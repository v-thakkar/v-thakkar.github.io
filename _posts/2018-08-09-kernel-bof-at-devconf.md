---
layout: post
title:  "Kernel BoF at Devconf.in"
categories: other
---
I attended [Devconf.in](https://devconf.info/in) last weekend. It was a fun and hectic conference meeting so many open source friends and long technical/community discussions. This blog post is mainly about the Kernel BoF hosted by me at the conference.

For those who don't know BoF usually stands of Birds of Feather session. As per [wikipedia](https://en.wikipedia.org/wiki/Birds_of_a_feather_(computing)), usually it's an informal session at conferences where based on the similar interest, attendees gather in the same room and do discussions on a particular topic. While this is a common idea behind BoF sessions, Kernel BoF at Devconf.in wasn't a typical BoF session. It was somewhere between lightning talks, Kernel track and BoF session. My assumption was that there will be a diverse set of attendees, mainly categorized in 2 different sets: Kernelnewbies and Kernel hackers. And I wanted the session to turn out as an interesting one for both set of attendees. So, Kernel BoF was sort of like a semi-structured session. I asked in (Pune and Bangalore) kernel meetup mailing lists about an interest in the topic of discussions and talk for the BoF. And we ended up deciding on a bunch of 30/15 minute talks. The idea was to have talks covering different areas of Linux Kernel and then see where the discussion goes.

We had 2 hours and 15 minutes for the whole session and we were able to cover the following topics.

- **A whirlwind tour of Energy-aware Scheduling by [Amit Kucharia](https://twitter.com/idlethread)**

We started with 25-30 minutes of talk by Amit on scheduling, mainly focusing on project EAS by Linaro. It was quite an interesting overview of covering history of scheduler, how project EAS started and the current status of project EAS. Here, are [slides](https://github.com/nerdyvaishali/Talks/blob/master/Kernel_BoF/A%20whirlwind%20tour%20of%20Energy-aware%20Scheduling%20%40%20Devconf.in.pdf) from Amit's talk and note that it also contains links to bunch of articles on the project and ongoing effort of mainlining bunch of features (from talks on the same at Linaro Connect).

- **RISc-V workshop update by [Siddhesh Poyarekar](https://twitter.com/siddhesh_p)**

As you may know, RISC-V is a free and open ISA based on established RISC principles. There was a [RISC-V workshop](https://riscv.org/2018/07/risc-v-workshop-in-chennai-proceedings/) organized in IIT-Madras around Mid-July. Based on Atish Patra's talk at the RISC-V workshop, Siddhesh gave an update on the Kernel status for the same. Note that RISC-V support was added in kernel 4.15 version and you can find the introductory article on LWN here. Atish's talk from RISC-V workshop can be found [here](https://www.youtube.com/watch?v=6X6i0kcy3GA), do check it out as it contains lot of information about future plans and if you're someone looking for a way to start contributing to Linux Kernel, this can be something interesting. There is an IRC channel and mailing list too. 

In the Kernel BoF, this was 10-15 minutes of session, mainly talking about above mentioned things. Btw, there is a [Shakti Processor project](http://rise.cse.iitm.ac.in/shakti.html) started in IIT Madras, aimed at developing a complete reference SoC for each family variants of processors based on the RISC-V ISA from UC Berkeley.

- **Latest development in Audio subsystem by [Vinod Koul](https://twitter.com/vkoulk)**

This was 30 minutes session with an idea to cover bunch of things related to sound subsystem in the kernel. I was surprised that Vinod was able t cover so many topics like Audio stack, different topoligies, Project Sound open firmware, ALSA etc. Slides from the session can be found [here](https://github.com/nerdyvaishali/Talks/blob/master/Kernel_BoF/Audio_Union_Devconf_04082018.pdf).

- **VLA usage removal effort by [Allen Pais](https://twitter.com/allenpais)**

Allen talked about the Variable Length Array removals in the Linxu Kernel, how it started by Kees Cook and how we ended up with deciding on MAX. Allen's slides can be found [here](https://github.com/nerdyvaishali/Talks/blob/master/Kernel_BoF/VLA.pdf). Do check it out as italso contains links to bunch of interesting LWN articles (my fav: 'The joy of max()') on the same. This was a 10-15 minutes session.

Btw, I got a feedback from kernel newbies that this was the most interesting session, mainly because of the fact that it doesn't require much kernel knowledge and was mainly touching areas of C language. :)

- **Reduce KVM guest memory footprint by Pankaj Gupta**

I was glad that we had 10-15 minutes to talk about this topic as well. Pankaj mainly talk about the goal behind reducing KVM guest memory footprint, steps to achieve it and fake DAX flushing interface. Slides from the talk can be found [here](https://github.com/nerdyvaishali/Talks/blob/master/Kernel_BoF/DevConf_Blore_18.pdf) and you can also checkout RFC version of [patches for fake DAX flushing interface submitted by Pankaj in LKML](https://lkml.org/lkml/2018/7/13/102). 

I enjoyed hosting this and discussing bunch of topics with fellow kernel hackers, understanding the questions from kernelnewbies. I think we should do more semi structured sessions like this at conferences.

P.S. I maintain a repository named Kernel Bridge here with bunch of ideas on finding tasks or TODOS for Linux Kernel. I do not keep track of who is working on what but I usually get lot of emails from people who are interested in contributing to the Linux Kernel so just having a single link helps. If you're a kernel developer and you have a task list for the subsystem/project you're working on, feel free to send PR or email me and I'll add it there.

**Trivia**

We had to climb 8 floors to attend the BoF and all speakers had to sit on floor because by the time we reached at the room, it was full. I created twiiter moments for Kernel BoF [here](https://twitter.com/i/moments/1025779393350778882).
