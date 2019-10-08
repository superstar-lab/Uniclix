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

<div id="page-banner"></div>
<div class="product-pages">
    <div class="tg-first-section">
        <div class="container">
            <div class="row standard-padding text-center">
                <div class="col-xs-12">
                    <h2>Grow your Twitter audience and expand your influence</h2>
                    <p>Grow your community on Twitter by targeting the right audience. Think of our Booster tool as a matchmaker that connects you with people most interested in what you have to offer.</p>
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
