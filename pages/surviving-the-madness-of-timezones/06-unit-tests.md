---
title: Unit Tests
---

# Unit Tests

Finally, the thing that most developers hate but is very very important when
dealing with a variable like time.

If you've understood about atomic behaviours and simplification of problems from
the previous chapters, writing tests should now be a little more easy than it
would've been if you just got down to writing them.

There's not much for me to explain in this chapter other than saying that write
as many tests as you can think of when working with timezones.

**But**, make sure you write them with the scoped data in mind. Do not write
tests assuming the server would be in UTC+2 if you know you are only going to be
running in UTC+0 at all times.

For the client side of things, write tests to see if the generated payloads for
your network request are handling the expected conversions of data. Are the date
value being as proper timestamps or formatted time strings or any other
standardisation you've done to the value

The value needs to become your source of truth or you will end up creating
mismatches and will need to add a lot of monkey patches to avoid making drastic
changes to the system.

Here's an examples of how you could be testing something like holidays

```js
test('allow translated bookings', () => {
  const hotelTimezone = 'America/Chicago'
  const userTimezone = "Asia/Kolkata"

  const holidays = [
    // 26th Jan 2024 00:00:00 CDT
    DateTime.fromObject(
      {
        day: 26,
        month: 1,
        year: 2024,
      },
      {
        zone: hotelTimezone,
      }
    ),
  ]

  // 25th Jan 2024 12:30:00 CDT
  const targetBookingDate = DateTime.fromObject(
    {
      day: 26,
      month: 1,
      year: 2024,
    },
    {
      zone: userTimezone,
    }
  ).setZone(hotelTimezone)

  const result = canBook(targetBookingDate, holidays, hotelTimezone)
  
  // result should be true because it's 25th in America Chicago, if the user is booking from India 
  // for the date of 26th in India
  assert.ok(result)
})
```

### Mocking System Time

There's a very good chance you came accross this book after your application is
already in production and would like a way to add in tests for all the possible
cases that might already be breaking.

In cases like these you can use _time mocking_ , which basically shifts your
system time to a different zone or even a different time if you need it to.

One such library is `sinon` and here's how it'd look like in a JS test runner

```js
test('test the power of my will to do this', () => {
  const forcedCurrentDate = new Date(Date.UTC(2023, 11, 2))

  const sandbox = sinon.createSandbox()
  sandbox.useFakeTimers(forcedCurrentDate)

  // remaining test considering the above date

  sandbox.restore()
})
```
