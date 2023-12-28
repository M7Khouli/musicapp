import 'package:flutter/material.dart';

class LoadingScreen extends StatelessWidget {
  const LoadingScreen({super.key});

  void goToHome(final context)async{
    await Future.delayed(const Duration(seconds: 2));
    Navigator.popAndPushNamed(context,"/Home");
  }

  @override
  Widget build(BuildContext context) {
    goToHome(context);
    return const Scaffold(
      backgroundColor: Colors.green,
      body:Center(
        child: CircularProgressIndicator(),
      )
    );
  }
}
