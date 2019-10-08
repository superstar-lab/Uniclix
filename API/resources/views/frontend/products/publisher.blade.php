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
                    <h1 class="mb30">Craft the perfect post for each social network, all in a few clix</h1>
                    <a href="{{config('frontendclient.client_url')}}" class="btn theme-btn fw700 color-theme-btn">Get started now</a>
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
                    <h2>Auto scheduling</h2>
                    <p>Keep your social presence active 24/7 by automatically scheduling a post for all of your social accounts at once with unified clix, 
                        and Uniclix will publish them automatically for you.</p>
                </div>
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/pr-schedule.png')}}" title="Auto Scheduling" alt="Keep your social presence active 24/7 by automatically scheduling a post for all of your social accounts at once with unified Clix, and Uniclix will publish them automatically for you.">
                </div>
            </div>

            <div class="row standard-padding column-reverse">
                <div class="col-md-6 col-xs-12">
                    <img class="img-responsive" src="{{asset('/images/accounts-images.png')}}" title="Publish in all Social Media Accounts" alt="Schedule and publish content to Twitter, Facebook Pages and Groups, LinkedIn from one place with Uniclix.">
                </div>
                <div class="col-md-6 col-xs-12">
                    <h2>Publish in all social media accounts</h2>
                    <p>Schedule and publish content to Twitter, Facebook Pages and Groups, LinkedIn from one place with Uniclix.</p>
                </div>
            </div>

            <div class="row standard-padding">
                <div class="col-md-6 col-xs-12">
                    <h2>Tailored posts</h2>
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
                    <h2>Optimal send times</h2>
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
                    <img class="img-responsive draft-images" src="{{asset('/images/pr-draft-img.svg')}}" title="Draft posts" alt="Create drafts, get feedback, and refine content as a team">
                    <div class="subtitle">Draft posts</div>
                    <p>Create drafts, get feedback, and refine content as a team</p>
                </div>
                <div class="col-md-3 col-xs-12">
                    <img class="img-responsive draft-images" src="{{asset('/images/pr-approvals-img.svg')}}" title="Approvals" alt="Review posts for quality and brand before hitting publish">
                    <div class="subtitle">Approvals</div>
                    <p>Review posts for quality and brand before hitting publish</p>
                </div>
                <div class="col-md-3 col-xs-12">
                    <img class="img-responsive draft-images" src="{{asset('/images/pr-sync-img.svg')}}" title="Stay in sync" alt="Everyone’s posts will be shared within your preset schedule">
                    <div class="subtitle">Stay in sync</div>
                    <p>Everyone’s posts will be shared within your preset schedule</p>
                </div>
                <div class="col-md-3 col-xs-12">
                    <img class="img-responsive draft-images" src="{{asset('/images/pr-setup-img.svg')}}" title="Account management" alt="Easily share and manage access to each social account">
                    <div class="subtitle">Account management</div>
                    <p>Easily share and manage access to each social account</p>
                </div>
            </div>
        </div>
    </div>

    @include('frontend.includes.compareplans')

</div>

@include('frontend.includes.footer')

@endsection
