jqMessageBar
============

A jQuery plugin that provides a message bar to inform users of your application
about things you want them to know (informational, errors, etc).

Inspired by jBar (http://tympanus.net/codrops/2009/10/29/jbar-a-jquery-notification-plugin/)

Features
========

* display one or more messages with buttons to navigate between them
* can be positioned at the top or bottom of the page
* easy programmatic control (i.e. show, hide, showNext)

Plugin API
==========


* init: create the plugin, see the source for details about what options `init` accepts (p.s. I know that's lame, I want to provide "real" documentation in the near future...of course you could fork, do it and submit a pull request :)

```javascript
$('body').messagebar();
```

* show: show the messagebar

```javascript
    $('body').messagebar('show');
```

* hide: hide the messagebar

```javascript
    $('body').messagebar('hide');
```

* isShowing: returns true/false indicating whether the messagebar is being shown or not

```javascript
    $('body').messagebar('isShowing');
```

* addMessage(message, type): add a new message and associate with a type (see the "message_types" option in the `init` method). Messages are always added to the front of the list. If the message bar is already showing and you add a message it will not be immediately displayed. Instead you must invoke the `show` method after adding the message.

```javascript
    $('body').messagebar('addMessage', 'hello world', 'info');

    // add and show a message
        $('body').messagebar('addMessage', 'hello world', 'info').messagebar('show');
```

* showNext: show the next message, this assumes the message bar is already showing

```javascript
    $('body').messagebar('showNext');
```

* showPrevious: show the previous message, this assumes the message bar is already showing

```javascript
    $('body').messagebar('showPrevious');
```

Dependencies
============

* jQuery 1.6 (most likely works with older versions as well, presumably 1.4+)

Demo
====

To try it clone or download the project and open up index.html

Roadmap
=======

* see the issues I've added future enhancements there

License
=======

[MIT](http://en.wikipedia.org/wiki/MIT_License)