@extends('layouts.homepage')

@section('title')
Keep your social presence active
@endsection

@section('description')
Publish & schedule posts for multiple social media networks & accounts with a couple of clicks. Uniclix helps you determine the best times to post to reach maximum engagement.
@endsection

@section('image')
{{config('app.url')}}/images/publisher-img-1.svg
@endsection

@section('content')

@include('frontend.includes.projects_menu')

<div class="product-pages">
    <div class="p-first-section">
        <div class="container">
            <div class="row standard-padding">
                <div class="col-md-7 col-xs-12">
                    <h1 class="mb30">Craft the perfect post for each social network, all in few clix</h1>
                    <a href="https://web.uniclix.test" class="btn theme-btn fw700">Get started now</a>
                </div>
                <div class="col-md-5 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/publisher-img-1.svg')}}" title="Craft the perfect post for each social network, all in few clix" alt="Craft the perfect post for each social network, all in few clix">
                </div>
            </div>

            <div class="row standard-padding text-center">
                <div class="col-xs-12">
                    <h2>Keep your social presence active</h2>
                    <p class="p-container mb50">Publish & schedule posts for multiple social media networks & accounts with a couple of clicks. Uniclix helps you determine the best times to post to reach maximum engagement.</p>
                    <img class="img-responsive" src="{{asset('/images/publisher-img-2.svg')}}" title="Keep your social presence active" alt="Publish & schedule posts for multiple social media networks & accounts with a couple of clicks. Uniclix helps you determine the best times to post to reach maximum engagement.">
                </div>
            </div>

            <div class="row standard-padding">
                <div class="col-md-6 col-xs-12">
                    <h2>Auto Scheduling</h2>
                    <p>Keep your social presence active 24/7 by automatically scheduling a post for all of your social accounts at once with unified Clix, and UniClix will publish them automatically for you.</p>
                </div>
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/pr-schedule.png')}}" title="Auto Scheduling" alt="Keep your social presence active 24/7 by automatically scheduling a post for all of your social accounts at once with unified Clix, and UniClix will publish them automatically for you.">
                </div>
            </div>

            <div class="row standard-padding column-reverse">
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/accounts-images.png')}}" title="Publish in all Social Media Accounts" alt="Schedule and publish content to Twitter, Facebook Pages and Groups, LinkedIn from one place with UniClix.">
                </div>
                <div class="col-md-6 col-xs-12">
                    <h2>Publish in all Social Media Accounts</h2>
                    <p>Schedule and publish content to Twitter, Facebook Pages and Groups, LinkedIn from one place with UniClix.</p>
                </div>
            </div>

            <div class="row standard-padding">
                <div class="col-md-6 col-xs-12">
                    <h2>Tailored Posts</h2>
                    <p>Tailor each post for each social network and preview the posts before publishing.</p>
                </div>
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/pr-tailored-posts.png')}}" title="Tailored Posts" alt="Tailor each post for each social network and preview the posts before publishing.">
                </div>
            </div>

            <div class="row standard-padding column-reverse">
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/pr-compose-calendar.png')}}" title="Optimal Send Times" alt="Customize the best time to post and maximize the engagement with the recommended time for each account.">
                </div>
                <div class="col-md-6 col-xs-12">
                    <h2>Optimal Send Times</h2>
                    <p>Customize the best time to post and maximize the engagement with the recommended time for each account.</p>
                </div>
            </div>

            <div class="row standard-padding">
                <div class="col-md-6 col-xs-12">
                    <h2>Collaborate on content with your team</h2>
                    <p>Work together with your team to create content that’s high quality, on-brand, and that your audience is going to love.</p>
                </div>
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/pr-dashboard.png')}}" title="Collaborate on content with your team" alt="Work together with your team to create content that’s high quality, on-brand, and that your audience is going to love.">
                </div>
            </div>

            <div class="row standard-padding">
                <div class="col-md-3 col-xs-12">
                    <img class="img-responsive margin-center" src="{{asset('/images/pr-draft-img.svg')}}" title="Draft posts" alt="Create drafts, get feedback, and refine content as a team">
                    <div class="subtitle">Draft posts</div>
                    <p>Create drafts, get feedback, and refine content as a team</p>
                </div>
                <div class="col-md-3 col-xs-12">
                    <img class="img-responsive margin-center" src="{{asset('/images/pr-approvals-img.svg')}}" title="Approvals" alt="Review posts for quality and brand before hitting publish">
                    <div class="subtitle">Approvals</div>
                    <p>Review posts for quality and brand before hitting publish</p>
                </div>
                <div class="col-md-3 col-xs-12">
                    <img class="img-responsive margin-center" src="{{asset('/images/pr-sync-img.svg')}}" title="Stay in sync" alt="Everyone’s posts will be shared within your preset schedule">
                    <div class="subtitle">Stay in sync</div>
                    <p>Everyone’s posts will be shared within your preset schedule</p>
                </div>
                <div class="col-md-3 col-xs-12">
                    <img class="img-responsive margin-center" src="{{asset('/images/pr-setup-img.svg')}}" title="Account management" alt="Easily share and manage access to each social account">
                    <div class="subtitle">Account management</div>
                    <p>Easily share and manage access to each social account</p>
                </div>
            </div>

            <div class="row standard-padding text-center">
                <div class="col-xs-12">
                    <h2>Simplify Your Social Content Curation</h2>
                    <p>Find & share content on the fly. Uniclix auto-suggests content relevant to your topics of interest so that you don’t have to spend hours searching on the internet.</p>
                    <img class="img-responsive" src="{{asset('/images/cr-image-1.svg')}}" title="Simplify Your Social Content Curation" alt="Find & share content on the fly. Uniclix auto-suggests content relevant to your topics of interest so that you don’t have to spend hours searching on the internet.">
                </div>
            </div>

            <div class="row standard-padding">
                <div class="col-md-6 col-xs-12">
                    <h2>Discover Content</h2>
                    <p>Curate articles from thousands of sources that can base shared on the fly.</p>
                </div>
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/cr-image-2.png')}}" title="Discover Content" alt="Curate articles from thousands of sources that can base shared on the fly.">
                </div>
            </div>

            <div class="row standard-padding column-reverse">
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/cr-image-3.png')}}" title="Schedule Content" alt="Simply search streams by keyword to find curated content that you can share on the fly. No need to spends hours across the web searching for content">
                </div>
                <div class="col-md-6 col-xs-12">
                    <h2>Schedule Content</h2>
                    <p>Simply search streams by keyword to find curated content that you can share on the fly. No need to spends hours across the web searching for content</p>
                </div>
            </div>

            <div class="row standard-padding">
                <div class="col-md-6 col-xs-12">
                    <h2>Content Calendar</h2>
                    <p>Get an overview of your scheduled social media content displayed in the list</p>
                </div>
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/cr-image-4.png')}}" title="Content Calendar" alt="Get an overview of your scheduled social media content displayed in the list" >
                </div>
            </div>

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

            <div class="row standard-padding text-center">
                <div class="col-xs-12">
                    <h2>A simpler way to measure performance</h2>
                    <p>Track your social growth, and get meaningful stats on your social media accounts</p>
                    <img class="img-responsive" src="{{asset('/images/anl-images-1.svg')}}" title="A simpler way to measure performance" alt="Track your social growth, and get meaningful stats on your social media accounts">
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
                    <p>Track engagement for all of your individual post in one platform.</p>
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
