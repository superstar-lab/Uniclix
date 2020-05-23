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
            <h1 style="text-align: center;font-size: 60px;margin-top: 10%;">Joint the family<span class="point-pink-color">!</span><br>Become an affiliate and start generating income<span class="point-color">.</span></h1>
                <div class="home-subtitle">
                    <div><a href="https://uniclixapp.firstpromoter.com/">Be part of the affiliation program</a><span class="point-pink-color">&nbsp;.&nbsp;</span></div>
                </div>
        </div>
    </div>
</div>

<div class="tabset">

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
