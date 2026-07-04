---
icon: lucide/file-text
tags:
  - linux kernel
  - open source
  - reflections
---

# Kernel BoF at Devconf.in

_August 9, 2018_

<div class="post-tags post-tags--page" aria-label="Tags">
  <span class="post-tag">linux kernel</span>
  <span class="post-tag">open source</span>
  <span class="post-tag">reflections</span>
</div>

I attended [Devconf.in](https://devconf.info/in) last weekend. It was a fun and
hectic conference, meeting so many open source friends and having long
technical and community discussions. This blog post is mainly about the Kernel
BoF hosted by me at the conference.

For those unfamiliar with the term, BoF usually stands for Birds of a Feather
session. According to
[Wikipedia](https://en.wikipedia.org/wiki/Birds_of_a_feather_(computing)), it
is usually an informal session at conferences where attendees with similar
interests gather in the same room and discuss a particular topic.

While this is the common idea behind BoF sessions, Kernel BoF at Devconf.in was
not a typical BoF session. It was somewhere between lightning talks, a Kernel
track, and a BoF session. My assumption was that there would be a diverse set
of attendees, mainly categorized in two different sets: kernel newbies and
kernel hackers. I wanted the session to be interesting for both sets of
attendees.

So, Kernel BoF was a semi-structured session. I asked in the Pune and Bangalore
kernel meetup mailing lists about interest in topics and talks for the BoF, and
we ended up deciding on a bunch of 30-minute and 15-minute talks. The idea was
to have talks covering different areas of the Linux Kernel and then see where
the discussion goes.

We had two hours and 15 minutes for the whole session and were able to cover the
following topics.

## A whirlwind tour of Energy-aware Scheduling by Amit Kucharia

We started with a 25-30-minute talk by
[Amit Kucharia](https://twitter.com/idlethread) on scheduling, mainly focusing
on the EAS project by Linaro. It was quite an interesting overview, covering
the history of the scheduler, how the EAS project started, and the current
status of the project.

Here are the
[slides](https://github.com/v-thakkar/Talks/blob/master/Kernel_BoF/A%20whirlwind%20tour%20of%20Energy-aware%20Scheduling%20%40%20Devconf.in.pdf)
from Amit's talk. Note that they also contain links to articles on the project
and the ongoing effort of mainlining a bunch of features.

## RISC-V workshop update by Siddhesh Poyarekar

As you may know, RISC-V is a free and open ISA based on established RISC
principles. There was a
[RISC-V workshop](https://riscv.org/2018/07/risc-v-workshop-in-chennai-proceedings/)
organized at IIT Madras around mid-July. Based on Atish Patra's talk at the
RISC-V workshop, [Siddhesh Poyarekar](https://twitter.com/siddhesh_p) gave an
update on the kernel status for the same.

RISC-V support was added in kernel 4.15, and you can find the introductory LWN
article [here](https://lwn.net/Articles/749185/). Atish's talk from the RISC-V
workshop can be found
[here](https://www.youtube.com/watch?v=6X6i0kcy3GA). Do check it out as it
contains a lot of information about future plans. If you are looking for a way
to start contributing to the Linux Kernel, this can be something interesting.
There is an IRC channel and mailing list too.

In the Kernel BoF, this was a 10-15 minute session, mainly talking about the
above-mentioned things. There is also a
[Shakti Processor project](http://rise.cse.iitm.ac.in/shakti.html) started at
IIT Madras, aimed at developing a complete reference SoC for each family
variant of processors based on the RISC-V ISA from UC Berkeley.

## Latest development in Audio subsystem by Vinod Koul

This was a 30-minute session intended to cover a bunch of things related to the
sound subsystem in the kernel. I was surprised that
[Vinod Koul](https://twitter.com/vkoulk) was able to cover so many topics like
the audio stack, different topologies, Sound Open Firmware, ALSA, and more.
Slides from the session can be found
[here](https://github.com/v-thakkar/Talks/blob/master/Kernel_BoF/Audio_Union_Devconf_04082018.pdf).

## VLA usage removal effort by Allen Pais

[Allen Pais](https://twitter.com/allenpais) talked about Variable Length Array
removals in the Linux Kernel, how it started by Kees Cook, and how we ended up
deciding on `MAX`. Allen's slides can be found
[here](https://github.com/v-thakkar/Talks/blob/master/Kernel_BoF/VLA.pdf).
They also contain links to a bunch of interesting LWN articles, including my
favourite: "The joy of max()". This was a 10-15-minute session.

I got feedback from kernel newbies that this was the most interesting session,
mainly because it did not require much kernel knowledge and was touching areas
of the C language.

## Reduce KVM guest memory footprint by Pankaj Gupta

I was glad that we had 10-15 minutes to talk about this topic as well. Pankaj
mainly talked about the goal behind reducing KVM guest memory footprint, steps
to achieve it, and the fake DAX flushing interface. Slides from the talk can be
found
[here](https://github.com/v-thakkar/Talks/blob/master/Kernel_BoF/DevConf_Blore_18.pdf),
and you can also check out the RFC version of the
[patches for fake DAX flushing interface submitted by Pankaj in LKML](https://lkml.org/lkml/2018/7/13/102).

I enjoyed hosting this and discussing a bunch of topics with fellow kernel
hackers, while also understanding the questions from kernel newbies. I think we
should do more semi-structured sessions like this at conferences.

**P.S.** I maintain a repository named
[Kernel Bridge](https://github.com/v-thakkar/kernelbridge) with a bunch of
TODOs from different Linux Kernel projects and subsystems. I do not keep track
of who is working on what, but I usually get a lot of emails from people who
are interested in contributing to the Linux Kernel, so having a single link
helps.

If you are a kernel developer and you have a task list for the subsystem or
project you are working on, feel free to send a PR or email me and I will add
it there.

## Trivia

We had to climb eight floors to attend the BoF, and all speakers had to sit on
the floor because by the time we reached the room, it was full. I created
Twitter moments of Kernel BoF
[here](https://twitter.com/i/moments/1025779393350778882).

<nav class="blog-post-nav" aria-label="Blog post navigation">
  <a class="blog-post-nav__link blog-post-nav__link--prev" href="university-talks-2018.md">
    <span>Previous</span>
    <strong>&larr; University Talks for Year 2018</strong>
  </a>
  <a class="blog-post-nav__link blog-post-nav__link--next" href="asid-allocator-xen.md">
    <span>Next</span>
    <strong>ASID Allocator and TLB management in Xen for x86 &rarr;</strong>
  </a>
</nav>
