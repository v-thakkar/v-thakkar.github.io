---
layout: post
title:  "ASID Allocator and TLB management in Xen for x86"
categories: other
---
Recently I have been looking into changing how ASID allocator works in Xen for x86 architeture. I'll discuss
the motivation behind it in another post but this post is mostly my attempt at documenting how ASID allocator
in Xen works at the moment.

- **What is ASID(Address Space IDentifier) in the context of Xen?**

At the Xen level, ASIDs partition the physical TLB. Currently, they're mainly used in Xen to reduce the number
of TLB flushes. At hardware level, AMD SVM has a real field called ASID in VMCB (Virtual Memory Control Block)
and Intel VMX has an equivalent field called VPID.

- **How ASIDs are generated and managed in Xen?**

ASIDs are associated with physical CPU core in Xen. So their generation as well as management is done [per PCPU](https://elixir.bootlin.com/xen/latest/source/xen/arch/x86/hvm/asid.c#L49).
To minimize the overhead of ASID invalidation, at the time of TLB flush, ASIDs are tagged with a 64-bit
generation. As the ASID generations are 64 bit, overflow of generations never happens in Xen. So the case of overflow is
never optimized and rather ASID usage is simply disabled in such a case.

The generation of ASID/VPIDs happen in xen as part of the [AP bringup](https://elixir.bootlin.com/xen/latest/source/xen/arch/x86/smpboot.c#L204).
Basically, `_svm_cpu_up/_vmx_cpu_up` are being called by their respective `cpu_up` functions to setup the hook
in `hvm_function_table`.  In the case of AMD SVM, the range of ASID pool for each pcpu is determined by CPUID 0x8000000a[EBX].

- **How ASIDs are assigned in Xen?**

Currently, ASIDs are assigned in a round-robin scheme in Xen. Each time the guest's virtual address space is
changed, instead of flushing the TLB, new ASID is assigned to it. Which means that each time VMENTER happens,
new ASID is being [assigned](https://elixir.bootlin.com/xen/latest/source/xen/arch/x86/hvm/asid.c#L126).In Xen
HVM, there is a vendor neutral code which handles the assignment and flushing of the ASIDs. This vendor neutral
code is also respectively mapped to the real fields [ASID - AMD SVM)](https://elixir.bootlin.com/xen/latest/source/xen/arch/x86/hvm/svm/asid.c#L47)
and [VPID - Intel VMX](https://elixir.bootlin.com/xen/latest/source/xen/arch/x86/hvm/vmx/vmx.c#L4874).

- **TLB management in Xen**

Xen is responsible for maintaining the uniqueness and freshness of the ASID in each logical core of the machine.
Whenever a TLB flush is needed on a pcpu, the ASID/VPID has one added to it. It's a lazy flushing scheme which
works by always ticking over the tag in the TLB to guarantee that it's clean the next time you enter the VM,
without having to do an explicit TLB invalidation.

So currently in Xen, each vcpu of each domain(VM) has it's own ASID which is constantly changed as part of
VMENTER/VMRUN. Xen is responsible for enforcing TLB flushes under certain conditions. For example, when the
recently used ASID [exceeds the max ASID range](https://elixir.bootlin.com/xen/latest/source/xen/arch/x86/hvm/asid.c#L117)
on the logical core (pcpu), a complete TLB flush for all ASIDs is required. Xen decides if flushes is needed
or not via `hvm_asid_handle_vmenter` function. In SVM and VMX code, this function can be seen to be used
by boolean `need_flush`.

In the case of AMD SVM, there are also TLB_CONTROL bits in TLB_CONTROL field(058h) of the VMCB which are being
set during VMEXITs. With the different values of bits, the hardware performs one of the following operation
on the TLB:
  - TLB_CONTROL_DO_NOTHING (00h). The hardware does nothing.
  - TLB_CONTROL_FLUSH_ALL_ASID (01h). The hardware flushes the entire TLB.
  - TLB_CONTROL_FLUSH_ASID (03h). The hardware flushes all TLB entries whose ASID is equal to the ASID in the VMCB.
  - TLB_CONTROL_FLUSH_ASID_LOCAL (07h). The hardware flushes this guest VM’s non-global TLB entries.
  - Other values. All other values are reserved, so other values may cause problems when resuming guest VMs.

Xen makes use of [FlushByASID](https://elixir.bootlin.com/xen/latest/source/xen/arch/x86/hvm/svm/asid.c#L51)
feature when it's available.
