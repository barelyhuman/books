# Surviving The Madness Of Timezones

Been a programmer for almost 7 years now and having built multiple multi
timezone applications, I've always found it funny that the issues I've faced
were never talked about anywhere.

Timezones itself aren't complicated but then the varying use cases that we use
it for when building application makes it hard to be sure that things work as we
expect them to work.

The one and only solution you'll see online is "Just use UTC dates" which isn't
really a solution but rather a suggestion to avoid a lot of the problems that
using location specific dates might add to your life.

The book cannot possibly solve everything for you neither is it humanly possible
for me to think of all scenarios and applications that you might build. It is
however easier for me to pass down information on practices that can help you
reduce the overall madness into manageable chunks.

## Nomenclature

Let's make it easier for you to understand the book by setting a few constraints
and definitions to the words used in this book.

- Timezone - A unit to specify the zonal boundaries being used to define the
  current time.
- Local Timezone - Timezone tied to the client / user of the application
- UTC Offset - Difference in units from the UTC timezone to a particular
  timezone

## Patterns

- The book is written to be a reference and not a text book.
- Examples will be presented with more complicated topics to break down and
  visualize the problem better.
