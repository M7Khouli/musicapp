import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:soundscape/main.dart';

class MyAppBar extends AppBar {
  MyAppBar({super.key, required int appBarType})
      : super(
    backgroundColor: Colors.green,
    centerTitle: true,
    title: AppBarWidget(appBarType: appBarType),
  );
}

class AppBarWidget extends StatefulWidget {
  const AppBarWidget({super.key, required this.appBarType});

  final int appBarType;

  @override
  State<AppBarWidget> createState() => _AppBarWidgetState();
}

class _AppBarWidgetState extends State<AppBarWidget> {
  String _appBarText="";
  dynamic _fun=(){};

  Future<void> _updateAppBarState() async {
    switch (widget.appBarType) {
      case 0:
        await _checkToken();
        break;
      case 1:
        _setSignupState();
        break;
      default:
        _setEmptyState();
        break;
    }
  }

  Future<bool> showLogoutConfirmationDialog(BuildContext context) async {
    return await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Colors.grey[300],
          title: const Text('Confirm Logout'),
          content: const Text('Are you sure you want to log out?'),
          actions: <Widget>[
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Cancel',style:TextStyle(color:Colors.black)),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Logout',style: TextStyle(color:Colors.black),),
            ),
          ],
        );
      },
    ) ?? false; // If the dialog is dismissed by tapping outside, it returns null, which is handled by the `?? false`.
  }


  Future<void> _checkToken() async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    if (token != null) {
      if(_appBarText=="logout")return;
      setState(() {
        _appBarText = "logout";
        _fun = ()async {
          bool confirm=await showLogoutConfirmationDialog(context);
          if(confirm) {
            preferences.remove("token");
            token = null;
            setState(() {});
          }
        };
      });
    } else {
      if(_appBarText=="login")return;
      setState(() {
        _appBarText = "login";
        _fun = () async {
          await Navigator.pushNamed(context, "/Login");
          setState(() {});
        };
      });
    }
  }

  void _setSignupState() {
    _appBarText = "signup";
    _fun = () async {
      await Navigator.pushNamed(context, "/Signup");
      setState(() {});
    };
  }

  void _setEmptyState() {
    _appBarText = "";
    _fun = null;
  }

  @override
  Widget build(BuildContext context) {
    _updateAppBarState();
    return Row(
      children: [
        const Expanded(child: Padding(
          padding: EdgeInsets.fromLTRB(15,0,0,0),
          child: Center(child: Text("SoundScape",)),
        )),
        SizedBox(
          width: 80.0,
          child: TextButton(
            onPressed: _fun,
            style: const ButtonStyle(
                backgroundColor: MaterialStatePropertyAll(Colors.green)),
            child: Text(
              _appBarText,
              style: const TextStyle(color: Colors.black, fontSize: 18),
            ),
          ),
        )
      ],
    );
  }
}
