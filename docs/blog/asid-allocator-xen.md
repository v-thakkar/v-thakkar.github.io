---
icon: lucide/file-text
tags:
  - xen
  - linux kernel
  - open source
  - confidential computing
---

# ASID Allocator and TLB management in Xen for x86

_May 18, 2024_

<div class="post-tags post-tags--page" aria-label="Tags">
  <span class="post-tag">xen</span>
  <span class="post-tag">linux kernel</span>
  <span class="post-tag">open source</span>
  <span class="post-tag">confidential computing</span>
</div>

Recently I have been looking into changing how the ASID allocator works in Xen
for x86 architecture. I will discuss the motivation behind it in another post,
but this post is mostly my attempt at documenting how the ASID allocator in Xen
works at the moment.

## What is ASID in the context of Xen?

ASID stands for Address Space Identifier. At the Xen level, ASIDs partition the
physical TLB. Currently, they are mainly used in Xen to reduce the number of
TLB flushes. At the hardware level, AMD SVM has a real field called ASID in the
VMCB, the Virtual Memory Control Block, and Intel VMX has an equivalent field
called VPID.

## How ASIDs are generated and managed in Xen

ASIDs are associated with physical CPU cores in Xen, so their generation as
well as management is done
[per PCPU](https://elixir.bootlin.com/xen/latest/source/xen/arch/x86/hvm/asid.c#L49).

To minimize the overhead of ASID invalidation, at the time of TLB flush, ASIDs
are tagged with a 64-bit generation. As the ASID generations are 64-bit,
generation overflow never happens in Xen. So the overflow case is never
optimized, and ASID usage is simply disabled in such a case.

The generation of ASIDs/VPIDs happens in Xen as part of the
[AP bringup](https://elixir.bootlin.com/xen/latest/source/xen/arch/x86/smpboot.c#L204).
Basically, `_svm_cpu_up` and `_vmx_cpu_up` are called by their respective
`cpu_up` functions to set up the hook in `hvm_function_table`. In the case of
AMD SVM, the range of the ASID pool for each PCPU is determined by CPUID
`0x8000000a[EBX]`.

## How ASIDs are assigned in Xen

Currently, ASIDs are assigned in a round-robin scheme in Xen. Each time the
guest's virtual address space is changed, instead of flushing the TLB, a new
ASID is assigned to it. This means that each time VMENTER happens, a new ASID
is [assigned](https://elixir.bootlin.com/xen/latest/source/xen/arch/x86/hvm/asid.c#L126).

In Xen HVM, there is vendor-neutral code which handles the assignment and
flushing of the ASIDs. This vendor-neutral code is then respectively mapped to
the real fields
[ASID - AMD SVM](https://elixir.bootlin.com/xen/latest/source/xen/arch/x86/hvm/svm/asid.c#L47)
and
[VPID - Intel VMX](https://elixir.bootlin.com/xen/latest/source/xen/arch/x86/hvm/vmx/vmx.c#L4874).

## TLB management in Xen

Xen is responsible for maintaining the uniqueness and freshness of the ASID in
each logical core of the machine. Whenever a TLB flush is needed on a PCPU, the
ASID/VPID is incremented. It is a lazy flushing scheme which works by
always ticking over the tag in the TLB to guarantee that it is clean the next
time you enter the VM, without having to do an explicit TLB invalidation.

Currently in Xen, each vCPU of each domain, or VM, has its own ASID which is
constantly changed as part of VMENTER/VMRUN. To check how that looks in
practice, `xl` has a `debug-key` to dump the VMCBs. For example, here I am
dumping VMCBs of a domain with two vCPUs, and `asid` is printed as part of
it.

```console
$ xl debug-keys v
$ xl dmesg
```

```text
(XEN) >>> Domain 1 <<<
(XEN) VCPU 0
(XEN) Dumping guest's current state at key_handler...
(XEN) Size of VMCB = 4096, paddr = 0000000847733000, vaddr = ffff830847733000
(XEN) cr_intercepts = 0xfef3fef3 dr_intercepts = 0xffffffff exception_intercepts = 0x60082
(XEN) general1_intercepts = 0xbdc4000f general2_intercepts = 0x6f7f
(XEN) iopm_base_pa = 0x95518000 msrpm_base_pa = 0x847730000 tsc_offset = 0xffffff8cfff785f6
(XEN) tlb_control = 0 vintr = 0x10f0001 int_stat = 0
(XEN) event_inj 0000000000000000, valid? 0, ec? 0, type 0, vector 0
(XEN) exitcode = 0x78 exit_int_info = 0
(XEN) exitinfo1 = 0 exitinfo2 = 0
(XEN) asid = 0x22d np_ctrl = 0x1: NP
(XEN) virtual vmload/vmsave = 0, virt_ext = 0
(XEN) cpl = 0 efer = 0x1d01 star = 0x23001000000000 lstar = 0xffffffff82200000
(XEN) CR0 = 0x000000008005003b CR2 = 0x00007fc6781ee3c8
(XEN) CR3 = 0x0000000002e23001 CR4 = 0x0000000000770ef0
(XEN) RSP = 0xffffffff82e03e00  RIP = 0xffffffff820e26ca
(XEN) RAX = 0x0000000000004000  RFLAGS=0x0000000000000246
(XEN) DR6 = 0x00000000ffff0ff0, DR7 = 0x0000000000000400
(XEN) CSTAR = 0xffffffff82201470 SFMask = 0x0000000000257fd5
(XEN) KernGSBase = 0x0000000000000000 PAT = 0x0407050600070106
(XEN) SSP = 0x0000000000000000 S_CET = 0x0000000000000000 ISST = 0x0000000000000000
(XEN) H_CR3 = 0x00000008476c2000 CleanBits = 0xfffffff7
(XEN)        sel attr  limit   base
(XEN)   CS: 0010 029b ffffffff 0000000000000000
(XEN)   DS: 0000 0000 00000000 0000000000000000
(XEN)   SS: 0018 0c93 ffffffff 0000000000000000
(XEN)   ES: 0000 0000 00000000 0000000000000000
(XEN)   FS: 0000 0000 00000000 0000000000000000
(XEN)   GS: 0000 0000 00000000 ffff888103c00000
(XEN) GDTR: 0000 0000 0000007f fffffe0000001000
(XEN) LDTR: 0000 0000 00000000 0000000000000000
(XEN) IDTR: 0000 0000 00000fff fffffe0000000000
(XEN)   TR: 0040 0089 00004087 fffffe0000003000
(XEN) 	VCPU 1
(XEN) Dumping guest's current state at key_handler...
(XEN) Size of VMCB = 4096, paddr = 0000000847727000, vaddr = ffff830847727000
(XEN) cr_intercepts = 0xfef3fef3 dr_intercepts = 0xffffffff exception_intercepts = 0x60082
(XEN) general1_intercepts = 0xbdc4000f general2_intercepts = 0x6f7f
(XEN) iopm_base_pa = 0x95518000 msrpm_base_pa = 0x847724000 tsc_offset = 0xffffff8cfff785f6
(XEN) tlb_control = 0 vintr = 0x10f0001 int_stat = 0
(XEN) event_inj 0000000000000000, valid? 0, ec? 0, type 0, vector 0
(XEN) exitcode = 0x78 exit_int_info = 0
(XEN) exitinfo1 = 0 exitinfo2 = 0
(XEN) asid = 0x1ad np_ctrl = 0x1: NP
(XEN) virtual vmload/vmsave = 0, virt_ext = 0
(XEN) cpl = 0 efer = 0x1d01 star = 0x23001000000000 lstar = 0xffffffff82200000
(XEN) CR0 = 0x000000008005003b CR2 = 0x00007f6794e77000
(XEN) CR3 = 0x0000000102f7d005 CR4 = 0x0000000000770ee0
(XEN) RSP = 0xffffc9000008be58  RIP = 0xffffffff820e26ca
(XEN) RAX = 0x0000000000004000  RFLAGS=0x0000000000000246
(XEN) DR6 = 0x00000000ffff0ff0, DR7 = 0x0000000000000400
(XEN) CSTAR = 0xffffffff82201470 SFMask = 0x0000000000257fd5
(XEN) KernGSBase = 0x0000000000000000 PAT = 0x0407050600070106
(XEN) SSP = 0x0000000000000000 S_CET = 0x0000000000000000 ISST = 0x0000000000000000
(XEN) H_CR3 = 0x00000008476c2000 CleanBits = 0xfffffff7
(XEN)        sel attr  limit   base
(XEN)   CS: 0010 029b ffffffff 0000000000000000
(XEN)   DS: 0000 0000 00000000 0000000000000000
(XEN)   SS: 0018 0c93 ffffffff 0000000000000000
(XEN)   ES: 0000 0000 00000000 0000000000000000
(XEN)   FS: 0000 0000 00000000 0000000000000000
(XEN)   GS: 0000 0000 00000000 ffff888103c80000
(XEN) GDTR: 0000 0000 0000007f fffffe000003c000
(XEN) LDTR: 0000 0000 00000000 0000000000000000
(XEN) IDTR: 0000 0000 00000fff fffffe0000000000
(XEN)   TR: 0040 0089 00004087 fffffe000003e000
```

Xen is responsible for enforcing TLB flushes under certain conditions. For
example, when the recently used ASID
[exceeds the max ASID range](https://elixir.bootlin.com/xen/latest/source/xen/arch/x86/hvm/asid.c#L117)
on the logical core, or PCPU, a complete TLB flush for all ASIDs is required.
Xen decides if flushes are needed or not via the `hvm_asid_handle_vmenter`
function. In SVM and VMX code, this function can be seen to be used by the
boolean `need_flush`.

In the case of AMD SVM, there are also TLB_CONTROL bits in the TLB_CONTROL
field, `058h`, of the VMCB which are set during VMEXITs. With the different
bit values, the hardware performs one of the following operations on the
TLB:

- `TLB_CONTROL_DO_NOTHING` (`00h`): the hardware does nothing.
- `TLB_CONTROL_FLUSH_ALL_ASID` (`01h`): the hardware flushes the entire TLB.
- `TLB_CONTROL_FLUSH_ASID` (`03h`): the hardware flushes all TLB entries whose
  ASID is equal to the ASID in the VMCB.
- `TLB_CONTROL_FLUSH_ASID_LOCAL` (`07h`): the hardware flushes this guest VM's
  non-global TLB entries.
- Other values are reserved, so other values may cause problems when resuming
  guest VMs.

Xen makes use of the
[FlushByASID](https://elixir.bootlin.com/xen/latest/source/xen/arch/x86/hvm/svm/asid.c#L51)
feature when it is available.

## Conclusion

The current ASID allocator has served us well so far. But with advances
of confidential computing and modern hardware instructions like `TLBSYNC` and
`INVLPGB` on AMD EPYC machines, we have the opportunity to move away from
IPI-based TLB flushing.

In Xen, we have been working on adding support for AMD SEV, SEV-ES, and
SEV-SNP, and part of the work is to modernize the current ASID allocator. For
more on that, stay tuned.

<nav class="blog-post-nav" aria-label="Blog post navigation">
  <a class="blog-post-nav__link blog-post-nav__link--prev" href="kernel-bof-at-devconf.md">
    <span>Previous</span>
    <strong>&larr; Kernel BoF at Devconf.in</strong>
  </a>
  <a class="blog-post-nav__link blog-post-nav__link--next" href="whats-in-a-surname.md">
    <span>Next</span>
    <strong>The Father's surname: A Default worth questioning &rarr;</strong>
  </a>
</nav>
