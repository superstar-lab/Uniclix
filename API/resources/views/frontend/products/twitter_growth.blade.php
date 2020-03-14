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
<div class="product-pages">
    <div class="">
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
                <h1>Your twitter life is about to <br> get a boost<span class="point-color">.</span></h1>
                    <div class="home-subtitle">
                        <div>Target your audience<span class="point-pink-color">&nbsp;.&nbsp;</span>Clean-up inactives<span class="point-pink-color">&nbsp;.&nbsp;</span>Track performance</div>
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

    <div class="container">
        <div class="row standard-padding">
            <div class="col-md-6 col-xs-12">
                <h2>Follow relevant users only</h2>
                <p>Find users by interest, hashtags, location, and channels. Just set your target and we will find you most relevant active users to follow.</p>
            </div>
            <div class="col-md-6 col-xs-12">
                <img class="img-responsive" src="{{asset('/images/tg-image-2.png')}}" title="Follow relevant users only" alt="Find users by interest, hashtags, location, and channels. Just set your target and we will find you most relevant active users to follow.">
            </div>
        </div>

        <div class="row standard-padding column-reverse">
            <div class="col-md-6 col-xs-12">
                <img class="img-responsive" src="{{asset('/images/tg-image-3.png')}}" title="Unfollow Inactive users" alt="Find inactive or non-engaging users that you follow. With few clix a day clear your follow list and get rid of spammers.">
            </div>
            <div class="col-md-6 col-xs-12">
                <h2>Unfollow Inactive users</h2>
                <p>Find inactive or non-engaging users that you follow. With a few clix a day, clear your follow list and get rid of spammers.</p>
            </div>
        </div>

        <div class="row standard-padding">
            <div class="col-md-6 col-xs-12">
                <h2>Unfollow undesirable users</h2>
                <p>Track engagement for all of your individual posts in one platform.</p>
            </div>
            <div class="col-md-6 col-xs-12">
                <img class="img-responsive" src="{{asset('/images/tg-image-4.png')}}" title="Unfollow undesirable users" alt="Track engagement for all of your individual post in one platform.">
            </div>
        </div>
    </div>

    <div class="home-gradient-bg">
        <div class="container">
            <div class="row mt30 mb30">
                <div class="col-xs-12 text-center">
                    <h2>Sign up and see the difference.</h2>
                    <a href="{{config('frontendclient.client_url')}}?register&addon=twitter_growth&redirect=twitter-booster&period=monthly" class="signin-btn">Get Started</a>
                </div>
            </div>
        </div>
    </div>


    <div class="container standard-padding">
        <div class="row">
            <div class="col-xs-12 text-center">
                <h2>Learn more about other Uniclix products</h2>
                <div class="row">
                    <div class="col-md-3 col-xs-12">
                        <div class="card panel-shadow mt50">
                            <h5>Publisher</h5>
                            <p>Craft the perfect post for each social network</p>
                            <a href="{{route('products.publisher')}}">Learn more</a>
                        </div>
                    </div>
                    <div class="col-md-3 col-xs-12">
                        <div class="card panel-shadow mt50">
                            <h5>Content Curation</h5>
                            <p>Simplify your social content curation</p>
                            <a href="{{route('products.content_curation')}}">Learn more</a>
                        </div>
                    </div>
                    <div class="col-md-3 col-xs-12">
                        <div class="card panel-shadow mt50">
                            <h5>Social Listening</h5>
                            <p>Simplify your social content curation</p>
                            <a href="{{route('products.social_listening')}}">Learn more</a>
                        </div>
                    </div>
                    <div class="col-md-3 col-xs-12">
                        <div class="card panel-shadow mt50">
                            <h5>Analytics</h5>
                            <p>A simpler way to measure performance</p>
                            <a href="{{route('products.analytics')}}">Learn more</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@include('frontend.includes.footer')

@endsection
