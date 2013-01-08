# jQuery

How to add jQuery with local fallback

## HTML

```
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
  <script>window.jQuery || document.write('<script src="javascripts/vendor/jquery-1.8.3.min.js"><\/script>')</script>
  <script src="javascripts/main.js"></script>
```

## HAML

*Note: You don't need this in Rails*

```
	%script{src:'//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'}
	:javascript
		window.jQuery || document.write('<script src="javascript/vendor/jquery-1.8.3.min.js"><\/script>')
	%script{src:'javascripts/main.js'}
```