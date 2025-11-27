from django import template

register = template.Library()


@register.filter
def split(value, separator=","):
    if value:
        return [item.strip() for item in value.split(separator)]
    return []
