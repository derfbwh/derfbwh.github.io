---
layout: page
title: Archive
---

# Blog Posts

{% assign postsByYear = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
{% for year in postsByYear %}
## {{ year.name }}

{% for post in year.items %}
  * {{ post.date | date: "%b %d, %Y" }} &raquo; [ {{ post.title }} ]({{ post.url }})
{% endfor %}
{% endfor %}