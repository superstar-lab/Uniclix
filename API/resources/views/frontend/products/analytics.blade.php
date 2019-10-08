@extends('layouts.homepage')

@section('title')
A simpler way to measure performance
@endsection

@section('description')
Track your social growth, and get meaningful stats on your social media accounts
@endsection

@section('image')
{{config('app.url')}}/images/anl-images-1.svg
@endsection

@section('content')

@include('frontend.includes.projects_menu')

<div class="product-pages">
    <div class="p-first-section">
        <div class="container">
            <div class="row standard-padding text-center">
                <div class="col-xs-12">
                    <h2>A simpler way to measure performance</h2>
                    <p>Track your social growth, and get meaningful stats on your social media accounts</p>
                    <img class="img-responsive" src="{{asset('/images/anl-images-1.svg')}}" title="A simpler way to measure performance" alt="Track your social growth, and get meaningful stats on your social media accounts" >
                </div>
            </div>

            <div class="row standard-padding">
                <div class="col-md-6 col-xs-12">
                    <h2>Social Snapshot</h2>
                    <p>Get a meaningful and concise snapshot of your key Twitter, Facebook, and LinkedIn activities.</p>
                </div>
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/anl-image-2.png')}}" title="Social Snapshot" alt="Get a meaningful and concise snapshot of your key Twitter, Facebook, and LinkedIn activities.">
                </div>
            </div>

            <div class="row standard-padding column-reverse">
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/anl-image-3.png')}}" title="Engagement Metrics" alt="Get a clear view of engagement for each of your social media accounts.">
                </div>
                <div class="col-md-6 col-xs-12">
                    <h2>Engagement Metrics</h2>
                    <p>Get a clear view of engagement for each of your social media accounts.</p>
                </div>
            </div>

            <div class="row standard-padding">
                <div class="col-md-6 col-xs-12">
                    <h2>Post Performance Metrics</h2>
                    <p>Track engagement for all of your individual posts in one platform.</p>
                </div>
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/anl-image-4.png')}}" title="Post Performance Metrics" alt="Track engagement for all of your individual post in one platform.">
                </div>
            </div>

        </div>
    </div>

    @include('frontend.includes.compareplans')

</div>

@include('frontend.includes.footer')

@endsection
