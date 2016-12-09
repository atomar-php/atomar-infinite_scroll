<?php

namespace infinite_scroll;
use atomar\core\HookReceiver;
use atomar\core\Templator;

class Hooks extends HookReceiver
{
    // There are a number of hooks available. here is an example.
    function hookRoute($extension)
    {
        return array(
           // '/api/(?P<api>[a-zA-Z\_-]+)/?(\?.*)?' => 'infinite_scroll\controller\Api',
           // '/(\?.*)?' => 'infinite_scroll\controller\Index'
       );
    }

    function hookPage()
    {
        Templator::$css[] = '/assets/infinite_scroll/css/style.css';
        Templator::$js[] = '/assets/infinite_scroll/js/infinite_scroll.js';
    }

    function hookStaticAssets($module)
    {
        return array(
            "/assets/infinite_scroll/(?P<path>.*)"=>"assets"
        );
    }
}