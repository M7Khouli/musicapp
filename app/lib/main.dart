import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:soundscape/pages/lodaing_screen.dart';
import 'pages/home.dart';
import 'pages/authentication/log_in.dart';
import 'pages/authentication/sign_up.dart';
import 'pages/authentication/verification.dart';
import 'package:soundscape/pages/library.dart';

late SharedPreferences pref;
String? token,userName,userEmail,verificationCode;

void main() async{
  WidgetsFlutterBinding.ensureInitialized();
  pref=await SharedPreferences.getInstance();
  token=pref.getString("token");
  userEmail=pref.getString("email");
  userName=pref.getString("userName");
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {

    return MaterialApp(
      title: 'SoundScape',
      debugShowCheckedModeBanner: false,
      routes: {
        '/':(context)=>const LoadingScreen(),
        '/Home': (context) => const Home(),
        '/Login': (context) => const Login(),
        '/Signup':(context)=>const Signup(),
        '/Verification':(context)=>Verification(),
        '/Library':(context)=>const Library(),
      },
    );
  }
}
