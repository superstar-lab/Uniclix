@extends('layouts.homepage')
@section('title')
Create custom social streams
@endsection

@section('description')
Setup and track custom streams of social content, all organized by tabs so you can monitor them by category. Respond & comment directly on the content of your interest from the streams.
@endsection

@section('image')
{{config('app.url')}}/images/social-listening-img-1.png
@endsection

@section('content')

@include('frontend.includes.projects_menu')

<div class="product-pages">
    <div class="p-first-section">
        <div class="container">
            <div class="row standard-padding text-center">
                <div class="col-xs-12">
                    <h2>People are talking, make sure your listening.</h2>
                    <p>A great way to manage mentions and Monitor keywords and hashtags</p>
                    <img class="img-responsive" src="{{asset('/images/social-listening-img-1.png')}}" title="People are talking, make sure your listening." alt="A great way to manage mentions and Monitor keywords and hashtags">
                </div>
            </div>

            <div class="row standard-padding">
                <div class="col-md-6 col-xs-12">
                    <h2>Create custom social streams</h2>
                    <p>Setup and track custom streams of social content, all organized by tabs so you can monitor them by category. Respond & comment directly on the content of your interest from the streams.</p>
                </div>
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/sl-image-2.png')}}" title="Create custom social streams" alt="Setup and track custom streams of social content, all organized by tabs so you can monitor them by category. Respond & comment directly on the content of your interest from the streams.">
                </div>
            </div>

            <div class="row standard-padding column-reverse">
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/sl-image-3.png')}}" title="Search by keyword or hashtag" alt="Setup, and discover social conversation by hashtag, keyword in all languages to hear what people are saying about your industry, competition and your brand.">
                </div>
                <div class="col-md-6 col-xs-12">
                    <h2>Search by keyword or hashtag</h2>
                    <p>Setup, and discover social conversation by hashtag, keyword in all languages to hear what people are saying about your industry, competition and your brand.</p>
                </div>
            </div>

        </div>
    </div>

    @include('frontend.includes.compareplans')

</div>

@include('frontend.includes.footer')

@endsection
