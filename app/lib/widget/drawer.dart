import 'package:flutter/material.dart';
import 'package:soundscape/main.dart';

class MyDrawer extends Drawer {
  MyDrawer({super.key})
      : super(
          backgroundColor: Colors.grey[300],
          child: const MyDrawerWidget(),
        );
}

class MyDrawerWidget extends StatefulWidget {
  const MyDrawerWidget({super.key});

  @override
  State<MyDrawerWidget> createState() => _MyDrawerWidgetState();
}

class _MyDrawerWidgetState extends State<MyDrawerWidget> {
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: EdgeInsets.zero,
      children: <Widget>[
        DrawerHeader(
          decoration: const BoxDecoration(
            color: Colors.green,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              token != null
                  ? Text(userName??"no User found",
                      style: const TextStyle(color: Colors.black, fontSize: 24))
                  : const Text("login first"),
              token!=null
                  ?Text(userEmail??"no user found",style:const TextStyle(color:Colors.black,fontSize: 14))
                  :const Text("login first"),
              // Add more profile details here
            ],
          ),
        ),
        ListTile(
          leading: const Icon(Icons.home),
          title: const Text('Home'),
          onTap: () {
            Navigator.pop(context);
            Navigator.popAndPushNamed(context,"/Home");
          },
        ),
        ListTile(
          leading: const Icon(Icons.library_books),
          title: const Text('Library'),
          onTap: () {
            if(token!=null) {
              Navigator.pop(context);
              Navigator.popAndPushNamed(context,"/Library");
            }else{
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("you have to login first"))
              );
            }
          },
        ),
        ListTile(
          leading: const Icon(Icons.upload),
          title: const Text('Upload'),
          onTap: () {
            Navigator.pop(context); // Close the drawer
            // Navigate to Upload
          },
        ),
        ListTile(
          leading: const Icon(Icons.settings),
          title: const Text('Settings'),
          onTap: () {
            Navigator.pop(context); // Close the drawer
            // Navigate to Settings
          },
        ),
      ],
    );
  }
}
