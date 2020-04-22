@extends('layouts.homepage')

@push('styles')
    <link href="{{ asset('css/slick.css') }}" rel="stylesheet">
    <link href="{{ asset('css/slick-theme.css') }}" rel="stylesheet">
@endpush
@section('title')
Social Media Management Simplified
@endsection

@section('description')
Uniclix helps you centralize, manage and grow your social media accounts with just a couple of clicks.
@endsection

@section('image')
{{config('app.url')}}/images/imac.png
@endsection
@section('content')
<div id="home-banner">
    <div class="container">
        <div class="left-side-social">
            <div class="spacing"><a target="_blank" href="https://web.facebook.com/UniClixApp/"><img src="{{ asset('images/facebook-icon.svg') }}" /></a></div>
            <div class="spacing"><a target="_blank" href="https://twitter.com/UniClix"><img src="{{ asset('images/twitter-icon.svg') }}" /></a></div>
            <div class="spacing"><a target="_blank" href="https://linkedin.com/UniClix"><img src="{{ asset('images/linkedin-icon.svg') }}" /></a></div>
            <div class="spacing"><a target="_blank" href="https://www.instagram.com/uniclix/"><img src="{{ asset('images/instagram-icon.svg') }}" /></a></div>
        </div>
        <div class="row pb50 intro-banner">           
            <div class="home-image1"><img src="{{ asset('images/home-image1.svg') }}" class="img-responsive laptop-img" /></div>
            <div class="home-image2"><img src="{{ asset('images/home-image2.svg') }}" class="img-responsive laptop-img" /></div>
            <div class="col-md-12 col-xs-12">
                <h1>Manage all of your social <br> media accounts with just a <br> couple of clix<span class="point-color">.</span></h1>
                    <div class="home-subtitle">
                        <div>Schedule posts<span class="point-pink-color">&nbsp;.&nbsp;</span>Monitor conversations<span class="point-pink-color">&nbsp;.&nbsp;</span>
                        Auto-curate content<span class="point-pink-color">&nbsp;.&nbsp;</span>Track performance</div>
                    </div>
                <div class="button-layout">
                    <a class="btn theme-btn mt30" href="{{config('frontendclient.client_url')}}?register" target="_blank">Try 14 days for free</a>
                </div>
                <div class="home-image3"><img id="main-picture" src="{{ asset('images/home-image6.svg') }}" class="img-responsive laptop-img" /></div>
                <!-- <a href="/pricing" class="btn theme-btn mt30">Learn more</a> -->
            </div>
        </div>
    </div>
</div>

<?php 
    $items = [
        [
            "id" => 'schedule',
            "label" => "Scheduled posts",
            "label_id" => 'schedule_label',
            "image" => 'images/schedulepost-icon.svg',
            "image_id" => 'schedule_img',
            "triangle" => 'images/triangle-icon.svg',
            "triangle_id" => 'schedule_tri'
        ],
        [
            "id" => 'monitor',
            "label" => "Monitor conversations",
            "label_id" => 'monitor_label',
            "image" => 'images/monitor-icon.svg',
            "image_id" => 'monitor_img',
            "triangle" => 'images/triangle-icon.svg',
            "triangle_id" => 'monitor_tri'
        ],
        [
            "id" => 'auto',
            "label" => "Auto-curate content",
            "label_id" => 'auto_label',
            "image" => 'images/auto-icon.svg',
            "image_id" => 'auto_img',
            "triangle" => 'images/triangle-icon.svg',
            "triangle_id" => 'auto_tri'
            
        ],
        [
            "id" => 'track',
            "label" => "Track performance",
            "label_id" => 'track_label',
            "image" => 'images/track-icon.svg',
            "image_id" => 'track_img',
            "triangle" => 'images/triangle-icon.svg',
            "triangle_id" => 'track_tri'
        ],
    ]
?>
<div class="home-section-1">
    <div class="container">
        <div class="home-features mt100">
            @foreach($items as $item)
                <div class="col-md-3 col-xs-3">
                    <div class="vertical-image" id="{{$item['id']}}">
                        <div class="under-spacing"><img id="{{$item['image_id']}}" src="{{ asset($item['image']) }}" class="img-responsive" /></div>
                        <div class="under-spacing"><label id="{{$item['label_id']}}" style="color: #909090">{{$item['label']}}</label></div>
                        <div id="{{$item['triangle_id']}}" hidden><img src="{{ asset($item['triangle']) }}" class="img-responsive" /></div>
                    </div>
                </div>
            @endforeach

            <div class="row">
                <div class="col-xs-12 affordable-title">
                    <div class="row">
                        <div class="col-md-7">
                            <h3 class="light-heading">The most affordable and simple to use social media management platform</h3>
                        </div>
                        <div class="col-md-5">
                            <div class="row" style="margin-top: 10px">
                                <div class="col-md-4 register-button">
                                    <a style="text-decoration: none;color: white;" href="{{config('frontendclient.client_url')}}?register" target="_blank">Sign up</a>
                                </div>
                                <div class="col-md-7 col-md-offset-1 trial-button">
                                    <a style="text-decoration: none;color: #2D86DA;" href="{{config('frontendclient.client_url')}}?register" target="_blank">Try 14 days for free</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="post-crafting intro-section">
    <div class="container">
        <div class="col-md-8 col-xs-12">
            <img src="{{asset('images/home-image7.svg')}}" class="img-responsive laptop-img"/>
        </div>
        <div class="col-md-4 col-xs-12">
            <h1 class="sub-title">Schedule Posts</h1>
            <div class="pink-line"></div>
            <span class="description">Schedule and publish posts for multiple social media channels at once. Determine the best time of day to post to maximize your reach</span>
        </div>
    </div>
    <div class="home-image4"><img src="{{ asset('images/home-image3.svg') }}" class="img-responsive laptop-img" /></div>
</div>
<div class="collaborate-section intro-section">
    <div class="container">
        <div class="col-md-5 col-xs-12">
            <h1 class="sub-title">Monitor conversations</h1>
            <div class="pink-line"></div>
            <span class="description">Generate custom streams to monitor what others are saying about you and your topics of interest. React to multiple conversations to increase social engagement</span>
        </div>
        <div class="col-md-7 col-xs-12">
            <img src="{{asset('images/home-image8.svg')}}" class="img-responsive laptop-img"/>
        </div>
    </div>
    <div class="home-image5"><img src="{{ asset('images/home-image5.svg') }}" class="img-responsive laptop-img" /></div>
</div>
<div class="simplify-social intro-section" style="margin-top: 60px;">
    <div class="container">
        <div class="col-md-7 col-xs-12">
            <img src="{{asset('images/home-image13.svg')}}" class="img-responsive laptop-img"/>
        </div>
        <div class="col-md-5 col-xs-12">
            <h1 class="sub-title">Auto-curate content</h1>
            <div class="pink-line"></div>
            <span class="description">Get content  recommendations based on your topics of interest to save time digging on the internet</span>
        </div>
    </div>
</div>
<div class="home-image6"><img src="{{ asset('images/home-image11.svg') }}" class="img-responsive laptop-img" /></div>
<div class="post-crafting people-talking intro-section" style="margin-top: 120px;">
    <div class="container">        
        <div class="col-md-5 col-xs-12">
            <h1 class="sub-title">Track performance</h1>
            <div class="pink-line"></div>
            <span class="description">Track your social media performance and get meaningful stats to help optimize  your growth</span>
        </div>
        <div class="col-md-7 col-xs-12">
            <img src="{{asset('images/home-image10.svg')}}" class="img-responsive laptop-img"/>
        </div>
    </div>
    <div class="home-image4"><img src="{{ asset('images/home-image4.svg') }}" class="img-responsive laptop-img" /></div>
    <div class="home-image5"><img src="{{ asset('images/home-image15.svg') }}" class="img-responsive laptop-img" /></div>
</div>
<div class="learn-more intro-section">
    <div class="container">
        <div class="col-md-offset-3 col-md-8 twitter-booster">
            <div class="twitter-boost-title">We're more than a scheduling tool, explore other features that will help you grow your social network</div>
            <div class="tools">
                <div class="twitter-boost-subtitle">Twitter Booster</div>
                <span class="description">Grow your community on Twitter by targeting the right audience. 
            Think of our Booster tool as a matchmaker that connects you with people most interested in what you have to offer.</span>
                <div style="margin-top: 15px;">
                    <a href="{{route('products.twitter_growth')}}" class="learn-more-button">Learn more<img src="{{asset('images/arrow-icon.svg')}}"/></a>
                </div>
            </div>
        </div>
    </div>
</div>

@include('frontend.includes.readytostart')
@include('frontend.includes.footer')
@endsection

@push('scripts')
<script src="{{ asset('js/slick.min.js') }}"></script>
<script type="text/javascript">
    $(document).ready(function(){
        $("#main-picture").attr("src", '{{ URL::asset('/images/home-image6.svg') }}');
        $("#schedule_img").attr("src", '{{ URL::asset('/images/schedulepost-active-icon.svg') }}');
        $("#schedule_tri").show();
        $("#schedule_label").css("color", "#2D86DA");
    });
    
    $('.more-features-pics .single-item').slick({
        arrows: false,
        dots: true,
    });

    $('.testimonials-pics .single-item').slick({
        arrows: false,
        dots: true,
    });
    
    $('#schedule').click(function(){
        $("#main-picture").attr("src", '{{ URL::asset('/images/home-image6.svg') }}');
        
        $("#schedule_img").attr("src", '{{ URL::asset('/images/schedulepost-active-icon.svg') }}');
        $("#monitor_img").attr("src", '{{ URL::asset('/images/monitor-icon.svg') }}');
        $("#auto_img").attr("src", '{{ URL::asset('/images/auto-icon.svg') }}');
        $("#track_img").attr("src", '{{ URL::asset('/images/track-icon.svg') }}');
        
        $("#schedule_tri").show();
        $("#monitor_tri").hide();
        $("#auto_tri").hide();
        $("#track_tri").hide();
        
        $("#schedule_label").css("color", "#2D86DA");
        $("#monitor_label, #auto_label, #track_label").each(function(){ 
            $(this).css("color", "#909090"); 
        });
    });
    
    $('#monitor').click(function(){
        $("#main-picture").attr("src", '{{ URL::asset('/images/home-image12.svg') }}');
        
        $("#monitor_img").attr("src", '{{ URL::asset('/images/monitor-active-icon.svg') }}');
        $("#schedule_img").attr("src", '{{ URL::asset('/images/schedulepost-icon.svg') }}');
        $("#auto_img").attr("src", '{{ URL::asset('/images/auto-icon.svg') }}');
        $("#track_img").attr("src", '{{ URL::asset('/images/track-icon.svg') }}');
        
        $("#monitor_tri").show();
        $("#schedule_tri").hide();
        $("#auto_tri").hide();
        $("#track_tri").hide();
        
        $("#monitor_label").css("color", "#2D86DA");
        $("#schedule_label, #auto_label, #track_label").each(function(){ 
            $(this).css("color", "#909090"); 
        });
    });
    
    $('#auto').click(function(){
        $("#main-picture").attr("src", '{{ URL::asset('/images/home-image13.svg') }}');
        
        $("#auto_img").attr("src", '{{ URL::asset('/images/auto-active-icon.svg') }}');
        $("#schedule_img").attr("src", '{{ URL::asset('/images/schedulepost-icon.svg') }}');
        $("#monitor_img").attr("src", '{{ URL::asset('/images/monitor-icon.svg') }}');
        $("#track_img").attr("src", '{{ URL::asset('/images/track-icon.svg') }}');
        
        $("#auto_tri").show();
        $("#monitor_tri").hide();
        $("#schedule_tri").hide();
        $("#track_tri").hide();
        
        $("#auto_label").css("color", "#2D86DA");
        $("#monitor_label, #schedule_label, #track_label").each(function(){ 
            $(this).css("color", "#909090"); 
        });
    });
    
    $('#track').click(function(){
        $("#main-picture").attr("src", '{{ URL::asset('/images/home-image14.svg') }}');
        
        $("#track_img").attr("src", '{{ URL::asset('/images/track-active-icon.svg') }}');
        $("#schedule_img").attr("src", '{{ URL::asset('/images/schedulepost-icon.svg') }}');
        $("#auto_img").attr("src", '{{ URL::asset('/images/auto-icon.svg') }}');
        $("#monitor_img").attr("src", '{{ URL::asset('/images/monitor-icon.svg') }}');
        
        $("#track_tri").show();
        $("#monitor_tri").hide();
        $("#auto_tri").hide();
        $("#schedule_tri").hide();
        
        $("#track_label").css("color", "#2D86DA");
        $("#monitor_label, #auto_label, #schedule_label").each(function(){ 
            $(this).css("color", "#909090"); 
        });
    });
</script>
@endpush
