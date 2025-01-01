# Index

<ul class="list-disc">
{{$baseurl := .Meta.BaseURL}}
{{range .Data.content}}
<li class="leading-normal">
{{ $link := print $baseurl "surviving-the-madness-of-timezones/" .slug}}
<a class="inline-block" href="{{$link}}">
    <div>{{.title}}</div>
</a>
</li>
{{end}}
</ul>

## Support

The book is also available on [Gumroad - Surviving the madness of timezones](https://barelyreaper.gumroad.com/l/surviving-the-madness-of-timezones) in ePub and PDF formats
