<div class="join-business ready-section intro-section">
    <div class="container">

            <div class="col-md-8 col-sm-8 col-xs-12">
                <h3 class="fw300">Ready to Get Started?</h3>
                <p class="description">Uniclix offers the most affordable packages in the industry suitable for small businesses and individuals. Take advantage of our introductory offer.</p>
            </div>
            <div class="col-md-4 col-sm-4 col-xs-12 text-right lh7">
                @if (!empty($__env->yieldContent('get-started')))
                <a href="@yield('get-started')" class="btn signin-btn get-started-btn">Create new account</a>
                @else
                <a href="{{config('frontendclient.client_url')}}?register" class="btn signin-btn get-started-btn">Create new account</a>
                @endif
            </div>

    </div>
</div>
