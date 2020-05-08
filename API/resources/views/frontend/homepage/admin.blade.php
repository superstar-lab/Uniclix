<!doctype html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="{{config('seo-indexing.value')}}">
    <title>{{config('app.name')}} - admin</title>

    <meta name="title" content="Social Media Management Simplified">
    <meta name="description" content="Uniclix helps you centralize, manage and grow your social media accounts with just a couple of clicks.">

    <!--Facebook meta -->
    <meta property="og:title" content="Social Media Management Simplified">
    <meta property="og:description" content="Uniclix helps you centralize, manage and grow your social media accounts with just a couple of clicks.">
    <meta property="og:image" content="{{config('app.url')}}/images/imac.png">

    <!--Twitter meta -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@uniclix">
    <meta name="twitter:title" content="Social Media Management Simplified">
    <meta name="twitter:description" content="@Uniclix helps you centralize, manage and grow your social media accounts with just a couple of clicks.">
    <meta name="twitter:image" content="{{config('app.url')}}/images/imac.png" class="next-head">

    <!-- Scripts -->
    <script type="text/javascript" src="{{asset('js/jquery.min.js')}}"></script>
    <script type="text/javascript" src="{{asset('js/bootstrap/bootstrap.min.js')}}"></script>
    <script src="https://cdn.datatables.net/1.10.7/js/jquery.dataTables.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.0/jquery.validate.js"></script>
    <script src="https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap4.min.js"></script>
    <!-- Fonts -->

    <!-- Styles -->
    <link href="/favicon.ico" rel="favicon" type="image/ico">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" rel="stylesheet">
    <link href="{{asset('font-awesome/css/font-awesome.min.css')}}" rel="stylesheet" type="text/css">
    <link href="{{ asset('css/bootstrap/bootstrap.min.css') }}" rel="stylesheet">
    <!-- <link rel="stylesheet" href="https://cdn.datatables.net/1.10.7/css/jquery.dataTables.min.css"> -->
    <link href="{{ asset('css/frontend.css') }}" rel="stylesheet">
    <link href="{{ asset('css/projects.css') }}" rel="stylesheet">
    <link href="{{ asset('css/helper.css') }}" rel="stylesheet">
    <link href="{{ asset('css/uniclix.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
    <link href="https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css" rel="stylesheet">


    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-139556974-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'UA-139556974-1');
    </script>
</head>

<body>
    <div class="container" style="margin-top: 90px;font-family: sans-serif;width:100%;">
    <div class="admin-logout">
        <a href="{{url('/login/admin')}}" style="color:white;text-decoration:none;">Log out</a>
    </div>
        <table class="table table-bordered" id="users-table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>SignUp date</th>
                    <th>Email</th>
                    <th>FirstName</th>
                    <th>LastName</th>
                    <th>Current Plan</th>
                    <th>FreeTrial Status</th>
                    <th>StripeID</th>
                    <th>Trial Expire</th>
                    <th>SocialMedia Accounts</th>
                    <th>Login</th>
                    <th>List of Keywords</th>
                    <th>Next Billing Cycle</th>
                    <th>Canceled</th>
                </tr>
            </thead>
        </table>
    </div>
    <script>
        $(function() {
            $('#users-table').DataTable({
                processing: true,
                serverSide: true,
                ajax: '{{ url("admin/dashboard") }}',
                columns: [{
                        data: 'DT_RowIndex',
                        name: 'DT_RowIndex'
                    },
                    {
                        data: 'signupDate',
                        name: 'signupDate'
                    },
                    {
                        data: 'email',
                        name: 'email'
                    },
                    {
                        data: 'firstName',
                        name: 'firstName'
                    },
                    {
                        data: 'secondName',
                        name: 'secondName'
                    },
                    {
                        data: 'currentPlan',
                        name: 'currentPlan'
                    },
                    
                    {
                        data: 'freeTrial',
                        name: 'freeTrial'
                    },
                    {
                        data: 'stripeId',
                        name: 'stripeId'
                    },
                    {
                        data: 'trialExpire',
                        name: 'trialExpire'
                    },
                    {
                        data: 'socialMediaAccounts',
                        name: 'socialMediaAccounts'
                    },
                    {
                        data: 'action',
                        name: 'action',
                        orderable: false,
                        searchable: false
                    },
                    {
                        data: 'listOfKeywords',
                        name: 'listOfKeywords'
                    },
                    {
                        data: 'nextBillingCycle',
                        data: 'nextBillingCycle',
                    },
                    {
                        data: 'cancelStatus',
                        data: 'cancelStatus',
                    },
                ],
                
            });
        });
    </script>
</body>