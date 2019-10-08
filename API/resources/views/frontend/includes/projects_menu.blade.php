<?php
    $productsMenu = [
        "publisher" =>
        [
            "name" => "Publisher",
            "description" => "Craft the perfect post for each social network, all in…",
            "url" => route('products.publisher'),
            "active" => Request::is("social-media-calendar") ? 'active' : '',
            "id" => "publisher"
        ],
        "content_curation" =>
        [
            "name" => "Content Curation",
            "description" => "Simplify Your Social Content Curation",
            "url" => route('products.content_curation'),
            "active" => Request::is("content-curation-tool") ? 'active' : '',
            "id" => "content_curation"
        ],
        "social_listening" =>
        [
            "name" => "Social Listening",
            "description" => "People are talking, make sure your listening.",
            "url" => route('products.social_listening'),
            "active" => Request::is("social-listening-tool") ? 'active' : '',
            "id" => "social_listening"
        ],
        "analytics" => 
        [
            "name" => "Analytics",
            "description" => "A simpler way to measure performance",
            "url" => route('products.analytics'),
            "active" => Request::is("social-media-analytics") ? 'active' : '',
            "id" => "analytics"
        ],
        "twitter_growth" => [
            "name" => "Twitter Booster",
            "description" => "Grow your Twitter audience and expand your Influence",
            "url" => route('products.twitter_booster'),
            "active" => Request::is("twitter-booster-app") ? 'active' : '',
            "id" => "twitter_growth"
        ]
    ];
?>

<div id="page-banner">
</div>
<div class="projects-menu">
    <div class="container">
        <div class="projects-menu-container">
            <ul class="nav navbar-nav projects_menu">
                @foreach($productsMenu as $item)
                <li class="{{$item['active']}}"><a href="{{ $item['url'] }}">{{$item['name']}}</a></li>
                @endforeach
            </ul>

            <ul class="nav navbar-nav projects_menu projects_menu_mobile">
                @foreach($productsMenu as $item)
                @if($item['active'])
                <li class="{{$item['active']}}"><a href="javascript:void();">{{$item['name']}}</a><img src="{{asset('images/arrow-down-sign.svg')}}" />
                </li>
                <ul class="nav navbar-nav projects_menu projects_submenu">
                        @foreach($productsMenu as $item)
                        @if(!$item['active'])
                        <li class="{{$item['active']}}"><a href="{{$item['url']}}">{{$item['name']}}</a></li>
                        @endif
                        @endforeach
                </ul>
                @endif
                @endforeach
            </ul>
        </div>
    </div>
</div>

<script>
    $(document).ready(function(){
        $('.projects_menu_mobile > li').on('click', function(){
            $('.projects_submenu').slideToggle();
        });
    });
</script>
