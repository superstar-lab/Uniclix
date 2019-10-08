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

@section('content')
<div id="page-banner">
</div>
<div class="product-pages">
    <div class="p-first-section">
        <div class="container">
            <div class="row standard-padding">
                <div class="col-xs-12 text-center">
                    <h2>Uniclix price table</h2>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="tabset">

    <input type="radio" name="tabset" id="tab1" aria-controls="marzen" checked>
    <label for="tab1">Product Plan</label>

    <input type="radio" name="tabset" id="tab2" aria-controls="rauchbier">
    <label for="tab2">Twitter Growth</label>

    <div class="tab-panels">
        <section id="marzen" class="tab-panel plan-shadow">
            <div class="container">
                <div class="montly-annual text-right">
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
                <div class="text-right mb30">save up to 20%</div>
                <div class="pricing-plans">
                    
                    @foreach($paidPlans as $plan)
                        <div class="plan plan-shadow">
                            <div class="plan-name-container">
                                <div class="plan-name">{{$plan["Name"]}}</div>
                            </div>
                            <div class="plan-price-container">
                                <div>
                                    <span class="plan-price">$<span class="plan-price-amount">{{$plan["Monthly"]}}</span></span>
                                    <span class="fw700">/ mo</span>
                                </div>
                                <div class="billed-period">Billend monthly</div>
                            </div>
                            <div class="plan-content-container">
                                <div class="plan-items"><img src="{{asset('/images/plan-tick.svg')}}"> {{$plan["Social Accounts"]}} social accounts</div>
                                <div class="plan-items"><img src="{{asset('/images/plan-tick.svg')}}"> {{$plan["Post Limitation"]}} posts</div>
                                <div class="plan-items"><img src="{{asset('/images/plan-tick.svg')}}"> {{$plan["Users"]}} user</div>
                            </div>
                            <div class="plan-button-container">
                                <a class="btn plan-price-btn" href="{{config('frontendclient.client_url')}}?register&plan={{strtolower($plan['Name'])}}&period=annually">Start 30 days free trial</a>
                                <div class="plan-see-more">or <a href="#compareplans">see more features</a></div>
                            </div>
                        </div>
                    @endforeach
        
                </div>
                <div class="text-box plan-shadow">
                    Try our basic free plan. 2 social accounts, 10 posts per account, 1 user. <a href="{{config('frontendclient.client_url')}}?register&plan=basic&period=annually">Get started now</a>
                </div>
                <div class="compare-plans-container text-left" id="compareplans">
                    <h1>Compare plans</h1>
                </div>
                <div class="compare-plans-table-container">
                    <table class="compare-plans-table" style="width:100%">
                        <tr>
                            <th style="width:20%">
                            </th>
                            @foreach($allPlans as $plan)
                            <th>
                                <h5>{{$plan["Name"]}}</h5>
                                <a class="btn plan-price-btn" data-url="{{config('frontendclient.client_url')}}" data-addon="" data-plan="{{strtolower($plan['Name'])}}" data-period="annually" href="{{config('frontendclient.client_url')}}?register&plan={{strtolower($plan['Name'])}}&period=annually">Start 30 days trial</a>
                            </th>
                            @endforeach
                        </tr>
                        <tr class="grey-tr">
                            <td class="fs14 text-left">Monthly</td>
                            @foreach($allPlans as $plan)
                                @if($plan["Monthly"] > 0)
                                <td>${{$plan["Monthly"]}}</td>
                                @else
                                <td></td>
                                @endif
                            @endforeach
                        </tr>
                        <tr>
                            <td class="fs14 text-left">Annual Billing</td>
                            @foreach($allPlans as $plan)
                                @if($plan["Annual Billing"] > 0)
                                <td>${{$plan["Annual Billing"]}}</td>
                                @else
                                <td></td>
                                @endif
                            @endforeach
                        </tr>
                        <tr class="grey-tr">
                            <td class="fs14 text-left">Social Accounts</td>
                            @foreach($allPlans as $plan)
                            <td>{{$plan["Social Accounts"]}}</td>
                            @endforeach
                        </tr>
                        <tr>
                            <td class="fs14 text-left">Users</td>
                            @foreach($allPlans as $plan)
                            <td>{{$plan["Users"]}}</td>
                            @endforeach
                        </tr>
                        <tr class="grey-tr">
                            <td class="fs14 text-left">Post Limitation</td>
                            @foreach($allPlans as $plan)
                            <td class="plan-table-text">{{$plan["Post Limitation"]}}</td>
                            @endforeach
                        </tr>
                        <tr>
                            <td class="fs14 text-left">Schedule and Publish</td>
                            @foreach($allPlans as $plan)
                                @if($plan["Schedule and Publish"] === 'Limited')
                                <td class="plan-table-text">{{$plan["Schedule and Publish"]}}</td>
                                @else
                                <td><img src="{{asset('/images/plan-success.svg')}}"></td>
                                @endif
                            @endforeach
                        </tr>
                        <tr class="grey-tr">
                            <td class="fs14 text-left">Content Curation</td>
                            @foreach($allPlans as $plan)
                                @if($plan["Content Curation"] === 'Limited')
                                <td class="plan-table-text">{{$plan["Content Curation"]}}</td>
                                @else
                                <td><img src="{{asset('/images/plan-success.svg')}}"></td>
                                @endif
                            @endforeach
                        </tr>
                        <tr>
                            <td class="fs14 text-left">Mentions</td>
                            @foreach($allPlans as $plan)
                                @if(!$plan["Mentions"])
                                <td><img src="{{asset('/images/plan-cancel.svg')}}"></td>
                                @else
                                <td><img src="{{asset('/images/plan-success.svg')}}"></td>
                                @endif
                            @endforeach
                        </tr>
                        <tr class="grey-tr">
                            <td class="fs14 text-left">Social Listening & Monitoring</td>
                            @foreach($allPlans as $plan)
                                @if(!$plan["Social Listening & Monitoring"])
                                <td><img src="{{asset('/images/plan-cancel.svg')}}"></td>
                                @else
                                <td><img src="{{asset('/images/plan-success.svg')}}"></td>
                                @endif
                            @endforeach
                        </tr>
                        <tr>
                            <td class="fs14 text-left">Analytics</td>
                            @foreach($allPlans as $plan)
                                @if($plan["Analytics"] === 'Limited')
                                <td class="plan-table-text">{{$plan["Analytics"]}}</td>
                                @else
                                <td><img src="{{asset('/images/plan-success.svg')}}"></td>
                                @endif
                            @endforeach
                        </tr>
                        <tr class="grey-tr">
                            <td class="fs14 text-left">Advanced Schedule</td>
                            @foreach($allPlans as $plan)
                                @if(!$plan["Advanced Schedule"])
                                <td><img src="{{asset('/images/plan-cancel.svg')}}"></td>
                                @else
                                <td><img src="{{asset('/images/plan-success.svg')}}"></td>
                                @endif
                            @endforeach
                        </tr>
                        <tr>
                            <td class="fs14 text-left">Create and Manage Draft Posts</td>
                            @foreach($allPlans as $plan)
                                @if(!$plan["Create and Manage Draft Posts"])
                                <td><img src="{{asset('/images/plan-cancel.svg')}}"></td>
                                @else
                                <td><img src="{{asset('/images/plan-success.svg')}}"></td>
                                @endif
                            @endforeach
                        </tr>
                        <tr class="grey-tr">
                            <td class="fs14 text-left">Team: Invite Additional Users</td>
                            @foreach($allPlans as $plan)
                                @if(!$plan["Team: Invite Additional Users"])
                                <td><img src="{{asset('/images/plan-cancel.svg')}}"></td>
                                @else
                                <td><img src="{{asset('/images/plan-success.svg')}}"></td>
                                @endif
                            @endforeach
                        </tr>
                        <tr>
                            <td class="fs14 text-left">Approval Workflow</td>
                            @foreach($allPlans as $plan)
                                @if(!$plan["Approval Workflow"])
                                <td><img src="{{asset('/images/plan-cancel.svg')}}"></td>
                                @else
                                <td><img src="{{asset('/images/plan-success.svg')}}"></td>
                                @endif
                            @endforeach
                        </tr>
                        <tr>
                            <th style="width:20%">
                            </th>

                            @foreach($allPlans as $plan)
                            <th>
                                <h5>{{$plan["Name"]}}</h5>
                                <a class="btn plan-price-btn" data-url="{{config('frontendclient.client_url')}}" data-addon="" data-plan="{{strtolower($plan['Name'])}}" data-period="annually" href="{{config('frontendclient.client_url')}}?register&plan={{strtolower($plan['Name'])}}&period=annually">Start 30 days trial</a>
                            </th>
                            @endforeach
                            
                        </tr>
                    </table>
                </div>
            </div>
        </section>
        <section id="rauchbier" class="tab-panel plan-shadow">
            <div class="container">
                <div class="compare-plans-table-container">
                    <table class="compare-plans-table" style="width:100%">
                        <tr>
                            <th style="width:80%">
                            </th>
                            <th>
                                <h5>Twitter Growth</h5>
                                <a class="btn plan-price-btn" href="{{config('frontendclient.client_url')}}?register&addon={{strtolower($addon['name'])}}&redirect=twitter-booster&period=monthly">Buy now</a>
                            </th>
                        </tr>
                        <tr>
                            <td class="fs14 text-left">Monthly</td>
                            <td>${{$addon->monthly_price}}</td>
                        </tr>
                        <tr class="grey-tr">
                            <td class="fs14 text-left">Targeted Followers</td>
                            <td><img src="{{asset('/images/plan-success.svg')}}"></td>
                        </tr>
                        <tr>
                            <td class="fs14 text-left">Recommended Unfollowers</td>
                            <td><img src="{{asset('/images/plan-success.svg')}}"></td>
                        </tr>
                        <tr class="grey-tr">
                            <td class="fs14 text-left">Target Audience</td>
                            <td><img src="{{asset('/images/plan-success.svg')}}"></td>
                        </tr>
                        <tr>
                            <td class="fs14 text-left">DM</td>
                            <td><img src="{{asset('/images/plan-success.svg')}}"></td>
                        </tr>
                        <tr class="grey-tr">
                            <td class="fs14 text-left">Mentions</td>
                            <td><img src="{{asset('/images/plan-success.svg')}}"></td>
                        </tr>
                        <tr>
                            <th style="width:80%">
                            </th>
                            <th>
                                <a class="btn plan-price-btn" data-url="{{config('frontendclient.client_url')}}" data-addon="{{strtolower($addon['name'])}}" data-plan="" data-period="monthly" href="{{config('frontendclient.client_url')}}?register&addon={{strtolower($addon['name'])}}&redirect=twitter-booster&period=monthly">Buy now</a>
                                <h5>Twitter Growth</h5>
                            </th>
                        </tr>
                    </table>
                </div>
            </div>
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
