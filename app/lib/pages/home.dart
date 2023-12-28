import 'package:flutter/material.dart';
import '../widget/drawer.dart';
import '../widget/bar.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      appBar: MyAppBar(appBarType: 0),
      drawer: MyDrawer(),
      body: const Center(
        child:Text("hello"),
      ),
    );
  }
}
