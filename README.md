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


* init: create the plugin, see the source for details about what options `init` accepts

    $('body').messagebar();

* show: show the messagebar

    $('body').messagebar('show');

* hide: hide the messagebar

    $('body').messagebar('hide');

* isShowing: returns true/false indicating whether the messagebar is being shown or not

    $('body').messagebar('isShowing');

* addMessage(message, type): add a new message and associate with a type (see the "message_types" option in the `init` method). Messages are always added to the front of the list.

    $('body').messagebar('addMessage', 'hello world', 'info');

* showNext: show the next message, this assumes the message bar is already showing

    $('body').messagebar('showNext');

* showPrevious: show the previous message, this assumes the message bar is already showing

    $('body').messagebar('showPrevious');

Dependencies
============

* jQuery 1.6 (most likely works with older versions as well, presumably 1.4+)

Demo
====

To try it clone or download the project and open up index.html

License
=======

[MIT](http://en.wikipedia.org/wiki/MIT_License)