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

@section('get-started')
{{config('frontendclient.client_url')}}?register&addon=twitter_growth&redirect=twitter-booster&period=monthly
@endsection

@section('content')
<div id="home-banner">
    <div class="container">
        <div class="row pb50 intro-banner">           
            <div class="col-md-7 col-xs-12 pb50">
                <img src="{{ asset('images/imac.png') }}" class="img-responsive laptop-img" title="Twitter follower app" alt="Grow Your Twitter Brand with the Power of Artificial Intelligence">
            </div>
            <div class="col-md-5 col-xs-12 pb50">
                <h1>GROW YOUR AUDIENCE, EXPAND YOUR INFLUENCE</h1>
                <p class="mt20">With the Right Tool, Twitter Marketing is Easy!</p>
                <p class="mt20"><strong>Grow Your Twitter Brand with the Power of Artificial Intelligence</strong></p>
                <p class="mt20">Now you can Save Time and Work Smarter, not Harder.</p>
                <a class="btn theme-btn mt30" href="{{config('frontendclient.client_url')}}?register&addon=twitter_growth&redirect=twitter-booster&period=monthly&addontrial=true" target="_blank">Start 3 day free trial </a>
                <!-- <a href="/pricing" class="btn theme-btn mt30">Learn more</a> -->
            </div>
        </div>
    </div>
</div>
<div class="home-section-1 intro-section">
    <div class="container">

        <div class="col-md-6 col-xs-12">
            <div class="col-md-12">
                <img src="{{asset('images/cr-image-1.svg')}}" title="Twitter follower" alt="The most affordable and simple to use Twitter growth platform - all features included for only $10/month" />
            </div>
        </div>
        <div class="col-md-6 col-xs-12">
            <div class="col-md-12"> 

                <h3>Twitter follower app</h3>

                <p class="description">The most affordable and simple to use Twitter growth platform - all features included for only $10/month. </p>
                <p class="description">For the price of a cappuccino, you can grow your Twitter brand. </p>

            </div>
        </div>
    
    </div>
</div>
<div class="post-crafting intro-section">
    <div class="container">
        <div class="col-md-6 col-xs-12">
            <div class="col-md-12 text-content">
                <p class="title-description">TWITTER FOLLOW</p>

                <h3>Follow relevant users only</h3>
                
                <p class="description">Grow your community on Twitter by targeting the right audience. Think of our Booster tool as a matchmaker that connects you with people most interested in what you have to offer. 
<br><br>Find users by interest, hashtags, location, and channels. Just set your target and we will find you most relevant active users to follow.
</p>
            </div>
        </div>
        <div class="col-md-6 col-xs-12">
            <div class="col-md-12">
                <img src="{{asset('images/post_crafting.png')}}" title="Follow relevant twitter users only" alt="Grow your community on Twitter by targeting the right audience. Think of our Booster tool as a matchmaker that connects you with people most interested in what you have to offer. 
<br><br>Find users by interest, hashtags, location, and channels. Just set your target and we will find you most relevant active users to follow." />
            </div>
        </div>
    </div>
</div>

<div class="collaborate-section intro-section">
    <div class="container">
        <div class="col-md-6 col-xs-12">
            <div class="col-md-12">
                <img src="{{asset('images/collaborate_with_team.png')}}" title="Twitter unfollow app" alt="Quickly and easily find users you currently follow and find who to unfollow. Join other influencers and small businesses who trust our easy to use 
                    Twitter Unfollow tool to unfollow inactive users, egg profiles, unwanted avatars and undesirable users." />
            </div>
        </div>
        <div class="col-md-6 col-xs-12">
            <div class="col-md-12"> 
                <p class="title-description">TWITTER UNFOLLOW</p>

                <h3>Unfollow inactive users and undesirable users</h3>

                <p class="description">Quickly and easily find users you currently follow and find who to unfollow. Join other influencers and small businesses who trust our easy to use 
                    Twitter Unfollow tool to unfollow inactive users, egg profiles, unwanted avatars and undesirable users. </p>

            </div>
        </div>
    </div>
</div>
</div>

<div class="join-business intro-section">
    <div class="container">
        <h3>Join small and large business that use Uniclix to build their brands</h3>
        <a href="{{config('frontendclient.client_url')}}?register&addon=twitter_growth&redirect=twitter-booster&period=monthly" class="btn signin-btn get-started-btn">Get Started Now</a>
    </div>
</div>

<div class="simplify-social intro-section">
    <div class="container">
        <div class="col-md-6 col-xs-12">
            <div class="col-md-12 text-content">
                <p class="title-description">Content Curation</p>

                <h3>Simplify Your Social Content Curation</h3>
                
                <p class="description">Find & share content on the fly. 
                    Uniclix auto-suggests content relevant to your 
                    topics of interest so that you don’t have to spend hours searching on the internet.</p>
            </div>
        </div>
        <div class="col-md-6 col-xs-12">
            <div class="col-md-12">
                <img src="{{asset('images/simplify_your_social.png')}}" title="Simplify Your Social Content Curation" alt="ind & share content on the fly. 
                    Uniclix auto-suggests content relevant to your 
                    topics of interest so that you don’t have to spend hours searching on the internet."/>
            </div>
        </div>
    </div>
</div>

<div class="post-crafting people-talking intro-section">
    <div class="container">        
        
        <div class="col-md-6 col-xs-12">
            <div class="col-md-12">
                <img src="{{asset('images/people_talking.png')}}" title="People are talking, make sure your listening" alt="A great way to manage mentions and Monitor keywords and hashtags"/>
            </div>
        </div>
        <div class="col-md-6 col-xs-12">
            <div class="col-md-12 text-content">
                <p class="title-description">Monitor</p>

                <h3>People are talking, make sure your listening.</h3>

                <p class="description">A great way to manage mentions and Monitor keywords and hashtags</p>

                <h5>Create custom social streams</h5>
                
                <p class="description" >Setup and track custom streams of social content ,all organized by tabs so you can monitor them by category.
                    Respond & comment directly on the content of your interest from the streams.</p>
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
    $('.more-features-pics .single-item').slick({
        arrows: false,
        dots: true,
    });

    $('.testimonials-pics .single-item').slick({
        arrows: false,
        dots: true,
    });
</script>
@endpush