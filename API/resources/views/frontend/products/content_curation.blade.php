@extends('layouts.homepage')

@section('title')
Simplify Your Social Content Curation
@endsection

@section('description')
Find & share content on the fly. Uniclix auto-suggests content relevant to your topics of interest so that you don’t have to spend hours searching on the internet.
@endsection

@section('image')
{{config('app.url')}}/images/cr-image-1.svg
@endsection

@section('content')

@include('frontend.includes.projects_menu')

<div class="product-pages">
    <div class="p-first-section">
        <div class="container">
            <div class="row standard-padding text-center">
                <div class="col-xs-12">
                    <h2>Simplify your social content curation</h2>
                    <p>Find & share content on the fly. Uniclix auto-suggests content relevant to your topics of interest so that you don’t have to spend hours searching on the internet.</p>
                    <img class="img-responsive" title="Simplify Your Social Content Curation" alt="Find & share content on the fly. Uniclix auto-suggests content relevant to your topics of interest so that you don’t have to spend hours searching on the internet." src="{{asset('/images/cr-image-1.svg')}}">
                </div>
            </div>

            <div class="row standard-padding">
                <div class="col-md-6 col-xs-12">
                    <h2>Discover content</h2>
                    <p>Curate articles from thousands of sources that can be shared on the fly.</p>
                </div>
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" title="Discover Content" alt="Curate articles from thousands of sources that can base shared on the fly." src="{{asset('/images/cr-image-2.png')}}">
                </div>
            </div>

            <div class="row standard-padding column-reverse">
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/cr-image-3.png')}}" title="Schedule Content" alt="Simply search streams by keyword to find curated content that you can share on the fly. No need to spends hours across the web searching for content">
                </div>
                <div class="col-md-6 col-xs-12">
                    <h2>Schedule content</h2>
                    <p>Simply search streams by keyword to find curated content that you can share on the fly. No need to spend hours across the web searching for content</p>
                </div>
            </div>

            <div class="row standard-padding">
                <div class="col-md-6 col-xs-12">
                    <h2>Content calendar</h2>
                    <p>Get an overview of your scheduled social media content displayed in the list</p>
                </div>
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/cr-image-4.png')}}" title="Content Calendar" alt="Get an overview of your scheduled social media content displayed in the list">
                </div>
            </div>

        </div>
    </div>

    @include('frontend.includes.compareplans')

</div>

@include('frontend.includes.footer')

@endsection
