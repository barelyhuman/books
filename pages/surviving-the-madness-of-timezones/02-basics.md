---
title: Basics
---

# Basics

Let's establish the basic nomenclature(words and naming) that you need to know,
so the book isn't a blob of gibberish to you.

- **Zoned** - Contains timezone information
- **Translation** - Conversion from one timezone to another
- **Localize** - Time information in the local timezone (your timezone / user's
  timezone)

## Start the clocks

Thinking in different timezones isn't a skill you see every programmer work on,
somehow we all wish to be the smart ones and still decide not to actually learn
about what we are doing. I've had many such blind dates with the domain when I
started as programmer though, over the years it's become clear that
understanding the domain and the problem domain is something I just **have** to
do.

To start, let's understand the basic concept of how your system manages time.
The simplest and the most common one is by maintaining a timestamp counter. The
other one is requesting it for a particular geographical location from a time
proxy online. To keep things as simple as I can, we're going to use the Unix
timestamp.

The timestamp, isn't zoned, it has no idea of where or what it is. It's just a
programmtic value that started at 0 on 1st Jan 1970, and has been incrementing
since, because we didn't figure out a way to stop time.

While I'm writing this the timestamp is at `1699051085`. Please appreciate the
beauty of a number representing the various points in time for the entire
planet. This number means a different time in different timezones and let me
tell you how it manages to work everywhere and why it's so smart.

**Offset**, which is a distance represented by hours and minutes from where the
Unix timestamp started counting itself. The approximate location is Greewich and
is represented by the offset 0.

Example:

- 0 -> 1st Jan 1970 in Greenwich Mean Time
- 19800 -> 1st Jan 1970 in Indian Standard Time => +(plus) 5 hours and 30
  minutes
- -18000 -> 31st Dec 1969 in Central Time => -(minus) 5 hours and 0 minutes

So, just adding or removing a bit of offset is all the math we need to do to
figure out what the other timezone is doing right now. Sleeping, dancing, crying
for help while programming.

Though, if just knowing this bit of information would've saved the crisis, it
would have been so much easier to live life. Adding to the context, you need to
remember that the timestamp itself is still at offset 0

Simply put, the counter keeps increasing and your system just adds the required
offset to show it in your selected timezone.

This has worked really well for us as users but the programmers ? They've been
going through hell making sure things _just work_
