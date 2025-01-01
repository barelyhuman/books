---
title: Atomic Behaviours
---

# Atomic Behaviours

When working with timezone problems, we need to simplify problems down to the
basic bits of how they work so you can understand what you can and cannot solve.

We'll be doing that for this chapter.

To explain all the tricks, I need to introduce you to the problems, and do that
one by one so that you don't end up confused (which you most probably will be).

**Calendar**

The simplest thing you could do would be to build a calendar. And I don't mean a
big chunky one with all the bells and whistles where you can book appointments,
create events and everything. No, we build the one that the 90s kids would've
seen hanging behind doors and wooden furnishings. This calendar is year based
and it doesn't matter where on this planet you are the calendar looks the same.

You take your system time in UTC and add the offset of the timezone you are in
and boom you have the date that you are supposed to be on.

```plain
Current Time in UTC: 4th Nov 2023 00:00 am

<!-- + Offsets -->
Current Time in IST: 4th Nov 2023 05:30 am
Current Time in JST: 4th Nov 2023 09:00 am

<!-- - Offsets -->
Current Time in CDT: 3rd Nov 2023 19:00 am
```

To build it, you basically can give the user the option to select the timezone
they are in and then add or subtract the offset from the timestamp to get the
required value

**Adding a few bells**

We're trying to help users and build businesses, so the above isn't exactly
enough to handle the problems that timezones bring. So, let's start by adding in
events to this calendar.

Now, events are global, so they can't be timezone specific and so should be
handled in local zones.

Let's take a scenario where a client in Chicago,America (Central Time), wants to
talk to someone in Greenwich,England (Greenwich Mean Time). The difference in
these two timezones is between 5-6 hours based on day light savings. For now,
screw day light savings and just take the default 6 hour difference.

The timestamps already work in the way we wish to implement events so, we don't
need to write a complicated translation for this, we do the normal thing that
is, take the timestamp range in local time(Central Time) and just convert it to
UTC/GMT so that the calendar can then translate it by adding the offset to it
for the required timezone.

Example:

```plaintext
Event on 1st November 2023 9AM - 10AM CDT -> Event on 1st November 2023 2AM - 3AM UTC
<!-- Here the offset of CDT is -5 hours, so we add 5 hours to the original range -->
```

That's it, the original calendar app should still be able to show the event's
timing correctly no matter that timezone. This is what developers online mean
when they ask you to use and work with UTC.

The point isn't to think in UTC, but to make sure that the information is
transferred around in UTC. You can do this in a few ways, you can transfer the
unix timestamp around or you can transfer a standardised notation of date time
that allows us to figure out the value in UTC. One such notation is the ISO_8601
standard which is available in the JS Date constructor as the `.toISOString()`
method.

To repeat, you do it in local but transfer it in UTC so that other systems can
translate it to other timezones if needed.

The reason this works so easily right now is that you were thinking in Client
First, server next model. This is where JS shines where the times are strictly
user system specific so you never have to think about all this when working on
the client side of things.

I wouldn't have to write a book if it was all simple and easy though. Let's
complicate this now. We are now going to move towards a more distributed app
that has 2 different clients and does a little more than traslate between the 2
clients.

**Complicating Life**

The app we are building now, is more or less how most apps are built today,
there's a server, it handles storage of data and a client which manages the
User's behaviour.

This segregation makes it easy for us to still use the above concept of keeping
the dates localized to the user and then using the server to inform about it to
someone else.

Let's take an example of a system that handles multi zone bookings, aka,
allowing someone from India to book something in the USA based off of USA's
timings.

Why would you want to do that? Oh I'll tell you.

Imagine a hotel booking app. You are now working with people who might book your
hotel from various places. Someone traveling from Europe to India might want to
book your hotel, here's where the confusion starts.

A user, in Chicago wishes to book the hotel from 23rd to 25th in India because
they'll be here those days.

You now have 2 possible scenarios, is it the 23rd from 25th of India or 23rd to
25th of Chicago that needs to be shown on the portal.

A few of you are going, "How does it matter?". Well, 23rd in Chicago is 24th in
India, so we already have a problem because we are almost 11 hours head and the
booking slots would differ. This is also why hotel bookings use a range based
booking and not an hourly based booking.

How range based bookings work is, if you book for 24th, it starts from 24th at
11.00am to 25th at 12.00pm. You have a 12 hours (sometimes 13 hours) between the
2 days. This offsets the booking no matter where you book from.

But we aren't here to make life simple, we are here to complicate it, so now,
you are booking a hotel that allows hourly bookings online and now you have no
option but to choose a date and time. We are back to the original problem, what
is the date and time relative to? Are you booking it relative to India or
relative to user?

If you book it relative to user, you have to make sure you add a visual element
that shows the same representation in the target timezone, so the user is at
least informed of what the date and time is going to be when in the other
timezone.

If you are booking it relative to the timezone of the Hotel , in this case India
to avoid clunking your UI with additional data that you wish to avoid because
you just like to complicate things or are a minimalist like me, then you are now
trapped in the hell of timezones.

To get you to understand what the problem is. We are now using a language that
doesn't understand zoned dates and has no native way to move to another timezone
other than using offsets and every time you do a `new Date()`, you are back to
the user's timestamp and your target offset is lost.

`moment.js` has a way to switch the entire app to a single timezone which
patched a lot of internals and in 2023 it breaks a few of the API's that the
browser provides, so using it will also cause issues for a modern user.

Basically, you are standing at a door, behind which you already know that
dragons exist but you forgot to bring your sword because no one told you that
there would be a need to slay dragons to just go to the bathroom.

Or, in a non dramatic way. What looks like a simple task now involves fighting
with the programming language at every step of the way.

Let me describe the problem in a little more detail just to be sure we are all
on the same page.

JS, uses the user's system time, so when you are programming the client side,
you have to make sure that any kind of date handling needs to be done based on
the target's availability

Here the target is the Hotel which is in India, so if you wish to book the hotel
from 23rd 6.00pm - 24th 6.45pm while you are in Europe, you can't show the same
availability based on Europes time because the user would have to do the
calculations in their head and that's not fun.

As a nice developer, you decide to show the user that they are selecting it in
the Indian Timezone but now, how you do make sure that the browser understands
it?

Because `new Date()` is going to give you date values in the european timezone,
which will cause issues because a slight change in seconds can shift the date to
the next day.

What do we do? We do the same thing we talked about before, discard timezone
from the actual information and then add it later somehow.

That's one of the many solutions to a problem like this but the point being, you
now manage everything as strings or numbers where you get rid of the timezone
information and hold just the date and time.

```js
const bookingDatePair = [
  ['11/01/2023', '06:35pm'], //=> Start
  ['12/01/2023', '07:35pm'], //=> End
]
```

This information is isolated from whatever you wish to do with it. Similar to
how unix timestamp works.

You can now, initialize this on whatever timezone you wish, translate it to
whatever you wish to do with it and, it can be manipulated with javascript.

You now have the option to parse the above strings with any library or date
parser you deem fit. A personal favorite of mine for things like this is
`luxon`.

Let's complete the problem we started with. Now you have a date pair that can be
transferred to the server and it can compute the values for the timezone of the
target hotel.

```js
import { DateTime } from 'luxon'

function computeBookingTimes(bookingDatePair, hotelTimezone) {
  const startsAt = DateTime.fromFormat(
    bookingDatePair[0][0] + '|' + bookingDatePair[0][1],
    'dd/MM/yyyy|hh:mma',
    {
      zone: hotelTimezone,
    }
  )

  const endsAt = DateTime.fromFormat(
    bookingDatePair[1][0] + '|' + bookingDatePair[1][1],
    'dd/MM/yyyy|hh:mma',
    {
      zone: hotelTimezone,
    }
  )

  return {
    bookingValidFrom: startsAt.toJSDate(),
    bookingValidTo: endsAt.toJSDate(),
  }
}
```

What I should clarify here is that the above is still saved in DB as separate
strings of date and time without any offset and with the assumption that the
timezone value is always available for it.

This gives you more control while calculating additional stuff with these values
and it keeps reminding you not to use the `new Date` function because you are
dealing with arbitrary timezone information.
