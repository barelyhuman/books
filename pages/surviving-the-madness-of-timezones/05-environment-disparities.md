---
title: Environment Disparities
---

# Environment Disparities

The final nail in the coffin for these issues is how much we ignore the planning
and not setup our environments to be the exact clone of what they would be when
in production.

People run their backends in their local timezone thinking it will be fine but,
in reality it bites back and bites hard.

### Execution Environment

I already mentioned about running servers in different timezone when your
production would actually be running in UTC.

If your production is in UTC, you run your current server in UTC. Just run it.
Simple. Straightforward.

As for the _why?!_, if you go back to the previous chapters, I mentioned that JS
considers the systems current running zone and uses that to create new dates for
you, so if you were calculating something based on days then you'd have a
problem because if it's 2nd November 00:00 am in India, it's 1st November 6:30
pm in Greenwich, which means if your server creates a new date to see if it was
Monday or Tuesday, you'd get the wrong answer because it would be a different
day in both places.

You not running your local servers in UTC while also running the web app locally
would just have 2 instances running in your local timezone and you'd never see
the issue that your users are seeing because, for them the server that's talking
to the app is in UTC

### Date Math

Date math is really easy if it's all being done on the user's browser because
you can use any library like _date-fns_ or _luxon_ or _day.js_ or whatever else
comes out in a few years but, when working with zoned dates, you need to know
about the differences that can exist.

I mentioned the weekday being different in the prose I wrote above. That's one
of the most common mistakes I've seen when doing date based computation.

If you are processing dates and computing based on them on the server, make sure
you generalize the use of something that can handle zoned dates. `luxon` allows
doing this so that's a decent option but if you are someone who's already using
`date-fns` for all of it, you can find utilities online to help you with
creating zoned dates.

Zoned dates are still UTC based, but when computing relative data like weekdays
and the nearest holiday etc, you need to make sure that you are calculating them
on timestamps that are in those zones.

JAVA luckily has the concept of using zoned dates and that's one thing I really
wish JS could add in too.

### Data Retention

When working with multi timezone apps, a lot of people do the mistake of
ignoring the timezone information and not saving it in their database thinking
that they have the UTC timestamp and that should be enough.

_Nope_.

```plaintext
2023-11-04T18:30:00.000Z
```

That's an ISO standard string, that tells you the current time in UTC, it
doesn't tell you which timezone the string actually came from.

You just can't tell. It means it could be 5th November in India, but it also
means it's 4th November in Greenwich.

You can definitely use it to translate to the others but you lost the source of
that information the moment you decided not to store the source location.

For a hotel, this could be the timezone that the hotel operates in, you should
save it with the hotel's profile information. If you really think about it, all
of this could've been a part of the planning phase, but it's here because you
end up missing these thing during execution so I put it in the chapter where you
would be thinking about writing code and not planning how to build the
application.
