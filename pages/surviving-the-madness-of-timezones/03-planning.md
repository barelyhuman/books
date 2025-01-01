---
title: Planning
---

# Planning

I spent more time thinking about how to make this section fun because in all
honesty, it's not. The thing about planning when programming for timezones
mostly involves going through the domain or business logic and figuring out your
different targets.

You might be have multiple targets, or just one singular target; it still
doesn't save you from having to define them. Whether you define these in your
head or be nice and write it down so others can also get help from it is
something I leave to you.

## Targets

Targets are simply defined as, _What timezone(s) do you need to handle_. If
you're lucky, just 1 or _best of luck_ with whatever else you have planned for
your life

If you are building an app that's just user facing, has no server, no
international transactions then you just have one target timezone, **the
user's**

Not all apps are _just_ user facing, some of them are distributed, and some of
them run off of a server. When working with these apps you need to define and
scope out the different timezones you wish to deal with.

Here's what a generic web app might have to deal with.

- User's timezone (Random and decided by the system/platform they use)
- Server's timezone (Mostly UTC)
- Database's timezone (Mostly UTC)

Once you have these defined, you can add boundaries to your developement and
testing environment. We talk more about this in the chapter **Environment
Disparities** and **Unit Tests**

Defining targets is a scoping task and very important if you are working with a
federated or distributed system. When working with systems where there's just a
few targets, you might not have many complications but when these increase, it
makes it harder for you to keep track of the every translation that you wish to
do.

_TL;DR: make a note of the different targets_

## Translations

The other part of the planning is to figure out how your translations will work.

A translation in this book's context is converting a date/time from a certain
timezone to another timezone. There's also cases where you might wish to
separate the timezone offset from the date and time to isolate them and we'll
talk more about it in **Atomic Behaviours**.

During the planning stage, all you need to know about is

- What the time splits are going to look like.
- How do you plan to store, compute and transfer them over the network or
  between your interfaces

#### Example

We're making a parking booking app that allows booking a parking space from
anywhere in the world. You could be in India and book a parking in the USA based
on an event that might be happening there.

In this case, I can't just keep sending the UTC value of the web app user
everywhere since it would be invalid.

**Why would it be invalid?**

If the event's at 19:00 hours (7:00 pm) in USA (Central Daylight Time) on the
1st of November, then it's 2nd of November in India at that point a.k.a, the
user's time selection will cause a mismatch in the booking because even if the
user selected 1st November 17:00 in India, it's 1st November 7:00 in USA
(Central Daylight Time) at that point

So here, there's 2 translations.

1. User sees the booking durations based on the target (Event Location, USA)
2. Booking information is sent to the server in UTC

to simplify

1. Convert 1st November 2023, 19:00 pm IST => 1st November 2023, 19:00 (CDT)
2. Convert that to UTC => 2nd November 00.00 (UTC)

Laying down such computation possiblities saves you from depending on the Javascript Date object and instead only using the date utilities you might write to handle dates all the way from initiation to it's transfer over the network. It'll also save you from `new Date()` mishaps as long as you are careful.

Let's try soliving the potential issues with an example in **Atomic Behaviours**
