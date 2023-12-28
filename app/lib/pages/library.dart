import 'package:flutter/material.dart';
import 'package:soundscape/widget/bar.dart';
import 'package:soundscape/widget/drawer.dart';

class Library extends StatelessWidget {
  const Library({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      appBar:MyAppBar(appBarType: 2),
      drawer: MyDrawer(),
      body:const LibraryPage(),
    );
  }
}

class LibraryPage extends StatefulWidget {
  const LibraryPage({super.key});

  @override
  State<LibraryPage> createState() => _LibraryPageState();
}

class _LibraryPageState extends State<LibraryPage> {
  @override
  Widget build(BuildContext context) {
    return const Text("hello");
  }
}
