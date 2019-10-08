@extends('layouts.homepage')

@section('title')
Get Uniclix Twitter Unfollow Tool
@endsection

@section('description')
Join other influencers and small businesses who trust our easy to use Twitter Unfollow tool to unfollow inactive users, egg profiles, unwanted avatars and undesirable users.
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
                    <h2>Get Uniclix Twitter Unfollow Tool</h2>
                    <p>Join other influencers and small businesses who trust our easy to use Twitter Unfollow tool to unfollow inactive users, egg profiles, unwanted avatars and undesirable users.</p>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="row standard-padding">
            <div class="col-md-6 col-xs-12">
                <h2>Find inactive  and undesirable users & unfollowers</h2>
                <p>Quickly and easily find users you currently follow and find who to unfollow.</p>
            </div>
            <div class="col-md-6 col-xs-12">
                <img class="img-responsive" src="{{asset('/images/tg-image-2.png')}}" title="Find inactive  and undesirable users & unfollowers" alt="Quickly and easily find users you currently follow and find who to unfollow.">
            </div>
        </div>

        <div class="row standard-padding column-reverse">
            <div class="col-md-6 col-xs-12">
                <img class="img-responsive" src="{{asset('/images/tg-image-3.png')}}" title="Quickly, unfollow them" alt="Uniclix enables you to unfollow unwanted users fast.">
            </div>
            <div class="col-md-6 col-xs-12">
                <h2>Quickly, unfollow them</h2>
                <p>Uniclix enables you to unfollow unwanted users fast.</p>
            </div>
        </div>

        <div class="row standard-padding">
            <div class="col-md-6 col-xs-12">
                <h2>Stay within guidelines</h2>
                <p>Twitter has limits on following users. Therefore use Uniclix to stay within those limits by unfollowing extra followers that are inactive.</p>
            </div>
            <div class="col-md-6 col-xs-12">
                <img class="img-responsive" src="{{asset('/images/tg-image-4.png')}}" title="Stay within limits" alt="Twitter has limits on following users, Hence use Uniclix to stay within those limits by unfollowing extra followers that are inactive.">
            </div>
        </div>
    </div>

    <div class="home-gradient-bg">
        <div class="container">
            <div class="row mt30 mb30">
                <div class="col-xs-12 text-center">
                    <h2>Try Uniclix and see the difference.</h2>
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

    <div class="home-gradient-bg">
        <div class="container">
            <div class="row mt30 mb30">
                <div class="col-xs-12 text-center">
                    <p>Use Uniclix powerful Unfollow tool powered by AI algorithm. Complex algorithm, yet easy to use Twitter unfollow tool that help you save a lot of time and money managing and growing your following on Twitter. Instead of spending many hours of your time in daily bases trying to figure out who to unfollow, Uniclix unfollow tool will show you filtered list of inactive, and irrelevant users that provide no value to you or your brand, such as unfollowers, inactive users, egg profiles, recent unfollowers, or other undesirable people you would want to unfollow on Twitter.</p>

                    <p>By using our unfollow tool, you can focus your time on doing the things you like most, while you easily unfollow unfollowers, users with no value to you, along with any other reasons to unfollow people on Twitter, so your following continues to grow quick and easy with followers that matter more to you.</p>
                </div>
            </div>
        </div>
    </div>
</div>

@include('frontend.includes.footer')

@endsection
