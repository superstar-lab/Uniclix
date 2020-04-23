@extends('layouts.homepage')
@section('title')
Pricing
@endsection

@section('description')
See the pricing of Uniclix social media service and pick a plan that fits your business needs. With our set of tools, you will be able to publish in all social media accounts, track and analyze social data, listen to social media streams and much more.
@endsection

@section('image')
{{config('app.url')}}/images/tg-image-2.png
@endsection

@section('scripts')
    <script>
        $(() => {
            const toggle = $('#toggleMonthlyYearly')

            const modifyHref = (checked = false) => {
                const links = $('.plan-price-btn');
                links.each((i) => {
                    if (checked) {
                        links[i].href = links[i].href.replace('monthly', 'annually')
                    } else {
                        links[i].href = links[i].href.replace('annually', 'monthly')
                    }
                })
            }

            toggle.click(e => {
                const $toggle = $(toggle);

                if ($toggle.is( ':checked' )) {
                    $toggle.attr('checked', 'checked')
                    modifyHref(true)
                } else {
                    $toggle.removeAttr('checked')
                    modifyHref()
                }

            })
        })
    </script>
@endsection

@section('content')
<div id="page-banner">
    <div class="container">
        <div class="left-side-social">
        <div class="spacing"><a target="_blank" href="https://web.facebook.com/UniClixApp/"><img src="{{ asset('images/facebook-icon.svg') }}" /></a></div>
        <div class="spacing"><a target="_blank" href="https://twitter.com/UniClix"><img src="{{ asset('images/twitter-icon.svg') }}" /></a></div>
        <div class="spacing"><a target="_blank" href="https://linkedin.com/UniClix"><img src="{{ asset('images/linkedin-icon.svg') }}" /></a></div>
        <div class="spacing"><a target="_blank" href="https://www.instagram.com/uniclix/"><img src="{{ asset('images/instagram-icon.svg') }}" /></a></div>
    </div>
    <div class="row pb50 intro-banner">           
        <div class="twitter-booster2" style="top: 46%;"><img src="{{ asset('images/pricing-image1.svg') }}" class="img-responsive laptop-img" /></div>
        <div class="twitter-booster1" style="top: 9%;"><img src="{{ asset('images/pricing-image2.svg') }}" class="img-responsive laptop-img" /></div>
        <div class="col-md-12 col-xs-12">
            <h1 style="text-align: center;font-size: 60px;margin-top: 10%;">We have the right<br>  price for you<span class="point-color">.</span></h1>
                <div class="home-subtitle">
                    <div><span class="point-pink-color">&nbsp;.&nbsp;</span>Social Media Management<span class="point-pink-color">&nbsp;.&nbsp;</span>Twitter booster<span class="point-pink-color">&nbsp;.&nbsp;</span></div>
                </div>
        </div>
    </div>
</div>

<div class="tabset">

    <input type="radio" name="tabset" id="tab1" aria-controls="marzen" checked>
    
    <label for="tab1">
        <div class="row pricing-buttons">
            <div class="arrow-container">
                <div>
                    <img src="{{ asset('images/twitter-booster-image9.svg') }}" />
                </div>
            </div>
            <div>Social Media Manager</div>
        </div>
    </label>

    <input type="radio" name="tabset" id="tab2" aria-controls="rauchbier">
    <label for="tab2">
        <div class="row pricing-buttons">
            <div class="arrow-container">
                <div>
                    <img src="{{ asset('images/twitter-booster-image9.svg') }}" />
                </div>
            </div>
            <div>Twitter Booster</div>
        </div>
    </label>

    <div class="tab-panels" style="margin-top: 7%;">
        <section id="marzen" class="tab-panel">
            <div class="container">
                <div class="montly-annual text-left">
                    <span class="billing-toggle">monthly billing</span>
                    <label class="label">
                    <div class="toggle">
                        <input id="toggleMonthlyYearly" class="toggle-state" type="checkbox" name="check" value="check" checked/>
                        <div class="toggle-inner">
                        <div class="indicator"></div>
                        </div>
                        <div class="active-bg"></div>
                    </div>
                    </label>
                    <span class="billing-toggle">annual billing</span>
                </div>
                <div class="text-left mb30" style="color:#2D86DA;font-style: italic; margin-left: 188px;">save up to 20%</div>
                <div class="twitter-booster1" style="top: 110%;z-index:-1;"><img src="{{ asset('images/pricing-image.svg') }}" class="img-responsive laptop-img" /></div>
                <div class="pricing-plans">
                    @foreach($paidPlans as $plan)
                        <div class="plan plan-shadow">
                            <div class="plan-name-container">
                                <h2 class="booster-title">{{$plan["Name"]}}</h2>
                            </div>
                            <div class="pricing-title">
                                @if($plan["Name"] == "Basic")
                                    Ideal for getting started
                                @elseif($plan["Name"] == "Premium")
                                    Ideal for growing brands
                                @else
                                    Ideal for larger teams
                                @endif
                            </div>
                            <div class="plan-price-container">
                                <div>
                                    <span class="plan-price">$<span class="plan-price-amount">{{$plan["Monthly"]}}</span></span>
                                    <span class="fw700">/ mo</span>
                                </div>
                                <div class="billed-period">Billed monthly</div>
                            </div>
                            <div class="plan-button-container">
                                @if($plan["Name"] == "Basic")
                                <a class="btn plan-price-btn" href="{{config('frontendclient.client_url')}}?register&selectedPlan={{$plan["Name"]}}&billingType=annually">Start 14 days free trial</a>
                                @else
                                <a class="btn plan-price-btn" href="{{config('frontendclient.client_url')}}?register&selectedPlan={{$plan["Name"]}}&billingType=annually">Sign up</a>
                                @endif
                                <div class="plan-see-more">or <a href="#compareplans">see more features</a></div>
                            </div>
                            <div class="plan-content-container">
                                <div class="plan-items"><img src="{{asset('/images/check-icon.svg')}}"> {{$plan["Social Accounts"]}} social accounts</div>
                                <div class="plan-items"><img src="{{asset('/images/check-icon.svg')}}"> {{$plan["Post Limitation"]}} posts</div>
                                <div class="plan-items"><img src="{{asset('/images/check-icon.svg')}}">
                                    {{$plan["Users"]}}
                                    @if($plan["Users"] == 1)
                                        user
                                    @else
                                        users
                                    @endif
                                </div>
                            </div>
                            
                        </div>
                    @endforeach
        
                </div>
                <div class="home-image1" style="top: 180%;z-index:-1;"><img src="{{ asset('images/pricing-image3.svg') }}" class="img-responsive laptop-img" /></div>
                <div class="compare-plans-container text-left" id="compareplans">
                    <h1>Compare plans</h1>
                </div>
                <div class="compare-plans-table-container">
                    <div style="padding: 40px 50px 0px 50px;">
                        <table class="compare-plans-table" style="width:100%">
                            <tr>
                                <th class="table-title" style="width:20%">
                                </th>
                                @foreach($allPlans as $plan)
                                <th>
                                    <h2 class="booster-title">{{$plan["Name"]}}</h2>
                                </th>
                                @endforeach
                            </tr>
                            <tr class="">
                                <td class="table-title">Monthly</td>
                                @foreach($allPlans as $plan)
                                    @if($plan["Monthly"] > 0)
                                    <td>${{$plan["Monthly"]}}</td>
                                    @else
                                    <td></td>
                                    @endif
                                @endforeach
                            </tr>
                            <tr>
                                <td class="table-title">Annual Billing</td>
                                @foreach($allPlans as $plan)
                                    @if($plan["Annual Billing"] > 0)
                                    <td>${{$plan["Annual Billing"]}}</td>
                                    @else
                                    <td></td>
                                    @endif
                                @endforeach
                            </tr>
                            <tr class="">
                                <td class="table-title">Social Accounts</td>
                                @foreach($allPlans as $plan)
                                <td>{{$plan["Social Accounts"]}}</td>
                                @endforeach
                            </tr>
                            <tr>
                                <td class="table-title">Users</td>
                                @foreach($allPlans as $plan)
                                <td>{{$plan["Users"]}}</td>
                                @endforeach
                            </tr>
                            <tr class="">
                                <td class="table-title">Post Limitation</td>
                                @foreach($allPlans as $plan)
                                <td class="plan-table-text">{{$plan["Post Limitation"]}}</td>
                                @endforeach
                            </tr>
                            <tr>
                                <td class="table-title">Schedule and Publish</td>
                                @foreach($allPlans as $plan)
                                    @if($plan["Schedule and Publish"] === 'Limited')
                                    <td class="plan-table-text">{{$plan["Schedule and Publish"]}}</td>
                                    @else
                                    <td><img src="{{asset('/images/check-icon.svg')}}"></td>
                                    @endif
                                @endforeach
                            </tr>
                            <tr class="">
                                <td class="table-title">Content Curation</td>
                                @foreach($allPlans as $plan)
                                    @if($plan["Content Curation"] === 'Limited')
                                    <td class="plan-table-text">{{$plan["Content Curation"]}}</td>
                                    @else
                                    <td><img src="{{asset('/images/check-icon.svg')}}"></td>
                                    @endif
                                @endforeach
                            </tr>
                            <tr>
                                <td class="table-title">Mentions</td>
                                @foreach($allPlans as $plan)
                                    @if(!$plan["Mentions"])
                                    <td><img src="{{asset('/images/close-icon.svg')}}"></td>
                                    @else
                                    <td><img src="{{asset('/images/check-icon.svg')}}"></td>
                                    @endif
                                @endforeach
                            </tr>
                            <tr class="">
                                <td class="table-title">Social Listening & Monitoring</td>
                                @foreach($allPlans as $plan)
                                    @if(!$plan["Social Listening & Monitoring"])
                                    <td><img src="{{asset('/images/close-icon.svg')}}"></td>
                                    @else
                                    <td><img src="{{asset('/images/check-icon.svg')}}"></td>
                                    @endif
                                @endforeach
                            </tr>
                            <tr>
                                <td class="table-title">Analytics</td>
                                @foreach($allPlans as $plan)
                                    @if($plan["Analytics"] === 'Limited')
                                    <td class="plan-table-text">{{$plan["Analytics"]}}</td>
                                    @else
                                    <td><img src="{{asset('/images/check-icon.svg')}}"></td>
                                    @endif
                                @endforeach
                            </tr>
                            <tr class="">
                                <td class="table-title">Advanced Schedule</td>
                                @foreach($allPlans as $plan)
                                    @if(!$plan["Advanced Schedule"])
                                    <td><img src="{{asset('/images/close-icon.svg')}}"></td>
                                    @else
                                    <td><img src="{{asset('/images/check-icon.svg')}}"></td>
                                    @endif
                                @endforeach
                            </tr>
                            <tr>
                                <td class="table-title">Create and Manage Draft Posts</td>
                                @foreach($allPlans as $plan)
                                    @if(!$plan["Create and Manage Draft Posts"])
                                    <td><img src="{{asset('/images/close-icon.svg')}}"></td>
                                    @else
                                    <td><img src="{{asset('/images/check-icon.svg')}}"></td>
                                    @endif
                                @endforeach
                            </tr>
                            <tr class="">
                                <td class="table-title">Team: Invite Additional Users</td>
                                @foreach($allPlans as $plan)
                                    @if(!$plan["Team: Invite Additional Users"])
                                    <td><img src="{{asset('/images/close-icon.svg')}}"></td>
                                    @else
                                    <td><img src="{{asset('/images/check-icon.svg')}}"></td>
                                    @endif
                                @endforeach
                            </tr>
                            <tr>
                                <td class="table-title">Approval Workflow</td>
                                @foreach($allPlans as $plan)
                                    @if(!$plan["Approval Workflow"])
                                    <td><img src="{{asset('/images/close-icon.svg')}}"></td>
                                    @else
                                    <td><img src="{{asset('/images/check-icon.svg')}}"></td>
                                    @endif
                                @endforeach
                            </tr>
                            <tr>
                                <td class="table-title">Social media: Facebook Pages and Groups, Twitter, LinkedIn Pages and Profile</td>
                                @foreach($allPlans as $plan)
                                    @if(!$plan["Social Listening & Monitoring"])
                                    <td><img src="{{asset('/images/close-icon.svg')}}"></td>
                                    @else
                                    <td><img src="{{asset('/images/check-icon.svg')}}"></td>
                                    @endif
                                @endforeach
                            </tr>
                            <tr>
                                <th class="table-title" style="width:20%;border-bottom:none !important;">
                                </th>

                                @foreach($allPlans as $plan)
                                <th class="table-title-bottom">
                                    <a class="btn plan-price-btn" style="margin: 12px 12px;" data-url="{{config('frontendclient.client_url')}}" data-addon="" data-plan="{{strtolower($plan['Name'])}}" data-period="annually" href="{{config('frontendclient.client_url')}}?register&selectedPlan={{$plan["Name"]}}&billingType=annually">Get Started</a>
                                </th>
                                @endforeach
                                
                            </tr>
                        </table>
                        <div class="twitter-booster1" style="top: 220%;z-index:-1;"><img src="{{ asset('images/pricing-image4.svg') }}" class="img-responsive laptop-img" /></div>
                        <div class="home-image1" style="top: 280%;z-index:-1;"><img src="{{ asset('images/pricing-image5.svg') }}" class="img-responsive laptop-img" /></div>
                    </div>
                </div>
            </div>
            @include('frontend.includes.readytostart')
        </section>
        <section id="rauchbier" class="tab-panel">
            <div class="container" style="width: 70%;">
                <div class="compare-plans-table-container">
                    <div class="row">
                        <div class="col-md-6">
                            <div style="margin-top: 60px;">
                                <img src="{{ asset('images/twitter-booster-image.svg') }}" class="laptop-img" />
                            </div>
                            <div class="plan-price-container">
                                <div>
                                    <span class="plan-price">$<span class="">{{$addon->monthly_price}}</span></span>
                                    <span class="fw700" style="color: #2D86DA">/ mo</span>
                                </div>
                                <div class="booster-sub-title">Per account</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="plan-content-container" style="margin-top: 40px;margin-left: 46px;">
                                <div class="plan-items"><img src="{{asset('/images/check-icon.svg')}}">&nbsp;Targeted Followers</div>
                                <div class="plan-items"><img src="{{asset('/images/check-icon.svg')}}">&nbsp;Recommended Unfollowers</div>
                                <div class="plan-items"><img src="{{asset('/images/check-icon.svg')}}">&nbsp;Target Audience</div>
                                <div class="plan-items"><img src="{{asset('/images/check-icon.svg')}}">&nbsp;DM</div>
                                <div class="plan-items"><img src="{{asset('/images/check-icon.svg')}}">&nbsp;Mentions</div>
                                <div class="plan-items"><img src="{{asset('/images/check-icon.svg')}}">&nbsp;1 Twitter account</div>
                            </div>
                            <div class="plan-button-container" style="border:none;width: 80%;">
                                <a class="btn plan-price-btn" data-url="{{config('frontendclient.client_url')}}" 
                                data-addon="{{strtolower($addon['name'])}}" data-plan="" data-period="monthly" 
                                href="https://twitter.uniclixapp.com/?register&addon=twitter_growth&redirect=twitter-booster&period=monthly&addontrial=true">Start 3 days free trial</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="twitter-booster1" style="top: 110%;z-index:-1;"><img src="{{ asset('images/pricing-image.svg') }}" class="img-responsive laptop-img" /></div>
            @include('frontend.includes.readytostarttwitter')
        </section>
    </div>

</div>

<script>    
    
    function adjustPrices(element){

        if( element.is(':checked') )
        {

            $('.plan-price-amount').each(function(index){
                let currentPrice = parseFloat($(this).text());
            
                $(this).text((currentPrice * 10 / 12).toFixed(1));
            });

            $('.billed-period').text("Billed annually");

            $('.plan-price-btn').each(function(){
                let url = $(this).attr("href");
                url = url.replace('monthly', 'annually');
                $(this).attr("href", url);
            });
        }
        else {

            $('.plan-price-amount').each(function(index){
                let currentPrice = parseFloat($(this).text());
                $(this).text((currentPrice * 12 / 10).toFixed(1));
            });
            
            $('.billed-period').text("Billed monthly");

            $('.plan-price-btn').each(function(){
                let url = $(this).attr("href");
                url = url.replace('annually', 'monthly');
                $(this).attr("href", url);
            });
        }
    }

$(document).ready(function(){
    adjustPrices($("#toggleMonthlyYearly"));
    $("#toggleMonthlyYearly").click( function(){
        adjustPrices($(this));
    });
})
</script>
@include('frontend.includes.footer')

@endsection
