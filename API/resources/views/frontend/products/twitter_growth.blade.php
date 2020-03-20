@extends('layouts.homepage')

@section('title')
Grow your Twitter audience and expand your Influence
@endsection

@section('description')
Grow your community on Twitter by targeting the right audience. Think of our Booster tool as a matchmaker that connects you with people most interested in what you have to offer.
@endsection

@section('image')
{{config('app.url')}}/images/tg-image-2.png
@endsection

@section('get-started')
{{config('frontendclient.client_url')}}?register&addon=twitter_growth&redirect=twitter-booster&period=monthly
@endsection

@section('content')

<div id="home-banner"></div>
    <div class="container">
        <div class="left-side-social">
        <div class="spacing"><a target="_blank" href="https://web.facebook.com/UniClixApp/"><img src="{{ asset('images/facebook-icon.svg') }}" /></a></div>
        <div class="spacing"><a target="_blank" href="https://twitter.com/UniClix"><img src="{{ asset('images/twitter-icon.svg') }}" /></a></div>
        <div class="spacing"><a target="_blank" href="https://linkedin.com/UniClix"><img src="{{ asset('images/linkedin-icon.svg') }}" /></a></div>
        <div class="spacing"><a target="_blank" href="https://www.instagram.com/uniclix/"><img src="{{ asset('images/instagram-icon.svg') }}" /></a></div>
    </div>
    <div class="row pb50 intro-banner">           
        <div class="twitter-booster2"><img src="{{ asset('images/home-image3.svg') }}" class="img-responsive laptop-img" /></div>
        <div class="twitter-booster1"><img src="{{ asset('images/twitter-booster-image5.svg') }}" class="img-responsive laptop-img" /></div>
        <div class="col-md-12 col-xs-12">
            <h1 style="text-align: center;font-size: 60px;margin-top: 7%;">Your twitter life is about to <br> get a boost<span class="point-color">.</span></h1>
                <div class="home-subtitle">
                    <div>Target your audience<span class="point-pink-color">&nbsp;.&nbsp;</span>Clean-up inactives<span class="point-pink-color">&nbsp;.&nbsp;</span>Track performance</div>
                </div>
            <div class="button-layout">
                <a class="btn theme-btn mt30" href="{{config('frontendclient.client_url')}}?register" target="_blank">Try 14 days for free</a>
            </div>
            <div class="home-image3"><img id="main-booster" src="{{ asset('images/twitter-booster-image1.svg') }}" class="img-responsive laptop-img" /></div>
            <!-- <a href="/pricing" class="btn theme-btn mt30">Learn more</a> -->
        </div>
    </div>
    <?php 
    $items = [
        [
            "id" => 'target',
            "label" => "Target your audience",
            "label_id" => 'target_label',
            "image" => 'images/target-icon.svg',
            "image_id" => 'target_img',
            "triangle" => 'images/triangle-icon.svg',
            "triangle_id" => 'target_tri'
        ],
        [
            "id" => 'clean',
            "label" => "Clean-up inactives",
            "label_id" => 'clean_label',
            "image" => 'images/clean-icon.svg',
            "image_id" => 'clean_img',
            "triangle" => 'images/triangle-icon.svg',
            "triangle_id" => 'clean_tri'
        ],
        [
            "id" => 'track_booster',
            "label" => "Track performance",
            "label_id" => 'track_booster_label',
            "image" => 'images/track-booster-icon.svg',
            "image_id" => 'track_booster_img',
            "triangle" => 'images/triangle-icon.svg',
            "triangle_id" => 'track_booster_tri'
            
        ],
    ]
    ?>
    <div class="home-section-1">
        <div class="container">
            <div class="home-features mt100">
                @foreach($items as $item)
                    <div class="col-md-4 col-xs-12">
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
                                <h3 class="light-heading">Twitter booster tool to unfollow inactive users, egg profiles, unwanted avatars and undesirable users.</h3>
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
                <img src="{{asset('images/twitter-booster-image2.svg')}}" class="img-responsive laptop-img"/>
            </div>
            <div class="col-md-4 col-xs-12">
                <h1 class="sub-title">Find inactive, undesirable users and unfollowers</h1>
                <div class="pink-line"></div>
                <span class="description">Quickly and easily find users you currently follow and find who to unfollow.</span>
            </div>
        </div>
        <div class="twitter-booster3"><img src="{{ asset('images/twitter-booster-image6.svg') }}" class="img-responsive laptop-img" /></div>
    </div>
    <div class="collaborate-section intro-section">
        <div class="container">
            <div class="col-md-5 col-xs-12">
                <h1 class="sub-title">Quickly, unfollow them</h1>
                <div class="pink-line"></div>
                <span class="description">Uniclix enables you to unfollow unwanted users fast.</span>
            </div>
            <div class="col-md-7 col-xs-12">
                <img src="{{asset('images/twitter-booster-image3.svg')}}" class="img-responsive laptop-img"/>
            </div>
        </div>
        <div class="home-image5"><img src="{{ asset('images/twitter-booster-image7.svg') }}" class="img-responsive laptop-img" /></div>
    </div>
    <div class="simplify-social intro-section" style="margin-top: 60px;">
        <div class="container">
            <div class="col-md-7 col-xs-12">
                <img src="{{asset('images/twitter-booster-image4.svg')}}" class="img-responsive laptop-img"/>
            </div>
            <div class="col-md-5 col-xs-12">
                <h1 class="sub-title">Stay within guidelines</h1>
                <div class="pink-line"></div>
                <span class="description">Twitter has limits on following users. Therefore use Uniclix to stay within those limits by unfollowing extra followers that are inactive.</span>
            </div>
        </div>
    </div>
    <div class="home-image4"><img src="{{ asset('images/home-image11.svg') }}" class="img-responsive laptop-img" /></div>
    <div class="twitter-booster4"><img src="{{ asset('images/twitter-booster-image8.svg') }}" class="img-responsive laptop-img" /></div>
    <div class="learn-more intro-section">
        <div class="container">
            <div class="col-md-offset-3 col-md-8 twitter-booster" style="margin-top: 10%;">
                <div class="twitter-boost-title">Learn more tools that will help you organize your social networks</div>
                <div class="tools">
                    <div class="tool-icon"><img src="{{ asset('images/twitter-booster-image9.svg') }}" class="img-responsive laptop-img" /></div>
                    <div class="twitter-boost-subtitle">Social Media Management Simplefied</div>
                    <span class="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum diam metus, tincidunt in sodales auctor, euismod ut purus.</span>
                    <div style="margin-top: 15px;">
                        <a href="{{route('products.twitter_growth')}}" class="learn-more-button">Learn more<img src="{{asset('images/arrow-icon.svg')}}"/></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@include('frontend.includes.readytostart')
@include('frontend.includes.footer')

@endsection

@push('scripts')
<script type="text/javascript">
    $(document).ready(function(){
        $("#main-picture").attr("src", '{{ URL::asset('/images/twitter-booster-image1.svg') }}');
        $("#target_img").attr("src", '{{ URL::asset('/images/target-active-icon.svg') }}');
        $("#target_tri").show();
        $("#target_label").css("color", "#2D86DA");
    });
    
    $('#target').click(function(){
        $("#main-booster").attr("src", '{{ URL::asset('/images/twitter-booster-image1.svg') }}');
        
        $("#target_img").attr("src", '{{ URL::asset('/images/target-active-icon.svg') }}');
        $("#clean_img").attr("src", '{{ URL::asset('/images/clean-icon.svg') }}');
        $("#track_booster_img").attr("src", '{{ URL::asset('/images/track-booster-icon.svg') }}');
        
        $("#target_tri").show();
        $("#clean_tri").hide();
        $("#track_booster_tri").hide();
        
        $("#target_label").css("color", "#2D86DA");
        $("#clean_label, #track_booster_label").each(function(){ 
            $(this).css("color", "#909090"); 
        });
    });
    
    $('#clean').click(function(){
        $("#main-booster").attr("src", '{{ URL::asset('/images/twitter-booster-image3.svg') }}');
        
        $("#clean_img").attr("src", '{{ URL::asset('/images/clean-active-icon.svg') }}');
        $("#target_img").attr("src", '{{ URL::asset('/images/target-icon.svg') }}');
        $("#track_booster_img").attr("src", '{{ URL::asset('/images/track-booster-icon.svg') }}');
        
        $("#clean_tri").show();
        $("#target_tri").hide();
        $("#track_booster_tri").hide();
        
        $("#clean_label").css("color", "#2D86DA");
        $("#target_label, #track_booster_label").each(function(){ 
            $(this).css("color", "#909090"); 
        });
    });
    
    $('#track_booster').click(function(){
        $("#main-booster").attr("src", '{{ URL::asset('/images/twitter-booster-image4.svg') }}');
        
        $("#track_booster_img").attr("src", '{{ URL::asset('/images/track-booster-active-icon.svg') }}');
        $("#target_img").attr("src", '{{ URL::asset('/images/target-icon.svg') }}');
        $("#clean_img").attr("src", '{{ URL::asset('/images/clean-icon.svg') }}');
        
        $("#track_booster_tri").show();
        $("#target_tri").hide();
        $("#clean_tri").hide();
        
        $("#track_booster_label").css("color", "#2D86DA");
        $("#target_label, #clean_label").each(function(){ 
            $(this).css("color", "#909090"); 
        });
    });
</script>
@endpush