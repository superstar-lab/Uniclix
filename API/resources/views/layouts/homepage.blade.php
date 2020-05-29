<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="{{config('seo-indexing.value')}}">
    <title>{{config('app.name')}} - @yield('title')</title>

    <meta name="title" content="@yield('title')" >
    <meta name="description" content="@yield('description')" >

    <!--Facebook meta -->
    <meta property="og:title" content="@yield('title')" >
    <meta property="og:description" content="@yield('description')">
    <meta property="og:image" content="@yield('image')">

    <!--Twitter meta -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@uniclix">
    <meta name="twitter:title" content="@yield('title')">
    <meta name="twitter:description" content="@yield('description')" >
    <meta name="twitter:image" content="@yield('image')" class="next-head">

    <!-- Scripts -->
    <script type="text/javascript" src="{{asset('js/jquery.min.js')}}"></script>
    <script type="text/javascript" src="{{asset('js/bootstrap/bootstrap.min.js')}}"></script>
    <!-- Fonts -->

    <!-- Styles -->
    <link href="/favicon.ico" rel="favicon" type="image/ico">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" rel="stylesheet">
    <link href="{{asset('font-awesome/css/font-awesome.min.css')}}" rel="stylesheet" type="text/css">
    <link href="{{ asset('css/bootstrap/bootstrap.min.css') }}" rel="stylesheet">
    @stack('styles')
    @yield('scripts')
    <link href="{{ asset('css/frontend.css') }}" rel="stylesheet">
    <link href="{{ asset('css/projects.css') }}" rel="stylesheet">
    <link href="{{ asset('css/helper.css') }}" rel="stylesheet">
    <link href="{{ asset('css/uniclix.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id={{config('google-analytics.gtag-id')}}"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '{{config('google-analytics.gtag-id')}}');
    </script>

    <script type="text/javascript">
    (function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src='https://cdn.firstpromoter.com/fprom.js',t.onload=t.onreadystatechange=function(){var t=this.readyState;if(!t||"complete"==t||"loaded"==t)try{$FPROM.init("qtjnideb","{{config('first-promoter.origin-url')}}")}catch(t){}};var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)})();
    </script>

    <script src="{{config('tidio.url')}}" async></script>

    </head>
</head>
<body>

<?php 
    $menu = [
        "home" => 
        [
            "name" => "Home",
            "url" => '/',
            "id" => 'home',
            "active" => Request::is("/") ? 'active' : '',
            "submenu" => []
        ],
        "products" => [
            "name" => "Products",
            "url" => '#',
            "id" => 'products',
            "active" => Request::is("social-media-calendar") || Request::is("content-curation-tool") || Request::is("social-listening-tool") || Request::is("social-media-analytics") || Request::is("twitter-followers-app")? 'active' : '',
            "submenu" => [
                "twitter_growth" => [
                    "name" => "Twitter Booster",
                    "description" => "Grow your community on Twitter by targeting the right audience.",
                    "url" => route('products.twitter_booster'),
                    "active" => Request::is("twitter-followers-app") ? 'active' : '',
                    "id" => "twitter_growth"
                ],
                "social_media_manager" =>
                [
                    "name" => "Social Media Manager",
                    "description" => "Centralize, manage and grow your social media accounts.",
                    "url" => route('homepage.index'),
                    "active" => Request::is("social-listening-tool") ? 'active' : '',
                    "id" => "social_listening"
                ],
            ]
        ],
        "pricing" =>
        [
            "name" => "Pricing",
            "url" => route('pricing'),
            "id" => 'pricing',
            "active" => Request::is("pricing") ? 'active' : '',
            "submenu" => []
        ],
        "affiliate" =>
        [
            "name" => "Affiliate Program",
            "url" => route('affiliate'),
            "id" => 'affiliate',
            "active" => Request::is("affiliate") ? 'active' : '',
            "submenu" => []
        ],
        "blog" => 
        [
            "name" => "Blog",
            "url" => "https://blog.uniclixapp.com",
            "id" => 'blog',
            "active" => Request::is("blog") ? 'active' : '',
            "submenu" => []
        ]
    ];
?>
<!-- <div id="top-image"><img  class="img-responsive" src="{{ asset('images/top-office.png') }}" /></div> -->
<div class="full-height">
    <header id="header-wrap" class="header" role="banner">
        <div class="navbar navbar-default {{--navbar-fixed-top --}} menu-top">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a href="{{ route('homepage.index') }}" class="navbar-brand text-center">
                        <label class="home-title">Uniclix.</label>
                    </a>
                </div>
                <div class="navbar-collapse collapse">
                @if (!empty($__env->yieldContent('get-started')))
                <a href="@yield('get-started')" class="btn pull-right signin-btn nav-btn nav-btn-white">Get Started Now</a>
                @else
                <a href="{{config('frontendclient.client_url')}}?register" class="btn pull-right signin-btn nav-btn nav-btn-white">Get Started Now</a>
                @endif
                    <a href="{{config('frontendclient.client_url')}}" class="btn pull-right signin-btn nav-btn">Sign in</a>
                    
                    <nav>
                        <ul class="nav navbar-nav navbar-right">
                            @foreach($menu as $item)
                                <li id="{{$item['id']}}" class="{{$item['active']}}"><a href="{{$item['url']}}" class="page-scroll">{{$item['name']}}</a></li>
                            @endforeach
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
        <div class="projects-navbar">
            <div class="container">
                <div class="projects-navbar-container">
                    @foreach($menu['products']['submenu'] as $item)
                    <div class="projects-menu-item">
                        <h5>{{$item['name']}}<span class="point-color">.<span></h5>
                        <p>{{$item['description']}}</p>
                        <br>
                        <a href="{{ $item['url'] }}">Learn more</a>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>

        <div class="mobile-nav">
            <nav id="nav" class="nav" role="navigation">
                <a href="{{ route('homepage.index') }}" class="navbar-brand text-center"><label class="home-title">Uniclix.</label></a>
                <!-- ACTUAL NAVIGATION MENU -->
                <ul class="nav__menu" id="menu" tabindex="-1" aria-label="main navigation" hidden>
                    @foreach($menu as $item)
                        <li class="nav__item"><a href="{{$item['url']}}" class="nav__link {{$item['active']}}">{{$item['name']}}</a>
                            @if($item["id"] == "products")
                            <ul class="submenu">
                                @foreach($item['submenu'] as $subItem)
                                <li class="nav__item"><a href="{{$subItem['url']}}" class="nav__link {{$subItem['active']}}">{{$subItem['name']}}</a></li>
                                @endforeach
                            </ul>
                            @endif
                        </li>
                    @endforeach

                    <li class="nav__item"><a href="{{config('frontendclient.client_url')}}" class="btn signin-btn nav-btn">Sign in</a></li>
                    <li class="nav__item"><a href="{{config('frontendclient.client_url')}}?register" class="btn signin-btn nav-btn nav-btn-white">Get Started Now</a></li>
                </ul>
                
                <!-- MENU TOGGLE BUTTON -->
                <a href="#nav" class="nav__toggle" role="button" aria-expanded="false" aria-controls="menu">
                    <svg class="menuicon" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                    <title>Toggle Menu</title>
                    <g>
                        <line class="menuicon__bar" x1="13" y1="16.5" x2="37" y2="16.5"/>
                        <line class="menuicon__bar" x1="13" y1="24.5" x2="37" y2="24.5"/>
                        <line class="menuicon__bar" x1="13" y1="24.5" x2="37" y2="24.5"/>
                        <line class="menuicon__bar" x1="13" y1="32.5" x2="37" y2="32.5"/>
                        <circle class="menuicon__circle" r="23" cx="25" cy="25" />
                    </g>
                    </svg>
                </a>
                
                <!-- ANIMATED BACKGROUND ELEMENT -->
                <div class="splash"></div>
                
            </nav>
        </div>
    </header>

    <div class="content">
        @yield('content')
    </div>
</div>
@stack('scripts')
<script>
$(document).ready(function() {
    if ($(window).width() >= 768) {
        $("#products").on("mouseenter", function() {
           $(".projects-navbar").show();
        });
        $(".projects-navbar").on("mouseleave", function() {
           $(this).hide();  //or $('.overlay').hide()
        });
    }
});

const nav = document.querySelector('#nav');
const menu = document.querySelector('#menu');
const menuToggle = document.querySelector('.nav__toggle');
let isMenuOpen = false;


// TOGGLE MENU ACTIVE STATE
menuToggle.addEventListener('click', e => {
  e.preventDefault();
  isMenuOpen = !isMenuOpen;
  
  // toggle a11y attributes and active class
  menuToggle.setAttribute('aria-expanded', String(isMenuOpen));
  menu.hidden = !isMenuOpen;
  nav.classList.toggle('nav--open');
});


// TRAP TAB INSIDE NAV WHEN OPEN
nav.addEventListener('keydown', e => {
  // abort if menu isn't open or modifier keys are pressed
  if (!isMenuOpen || e.ctrlKey || e.metaKey || e.altKey) {
    return;
  }
  
  // listen for tab press and move focus
  // if we're on either end of the navigation
  const menuLinks = menu.querySelectorAll('.nav__link');
  if (e.keyCode === 9) {
    if (e.shiftKey) {
      if (document.activeElement === menuLinks[0]) {
        menuToggle.focus();
        e.preventDefault();
      }
    } else if (document.activeElement === menuToggle) {
      menuLinks[0].focus();
      e.preventDefault();
    }
  }
});

</script>
</body>
</html>
