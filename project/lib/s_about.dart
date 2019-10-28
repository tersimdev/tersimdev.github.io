import 'package:flutter/material.dart';
import 'package:ts_portfolio/utility.dart';

class SectAbout extends StatefulWidget {
  SectAbout({Key key}) : super(key: key);

  @override
  _SectAboutState createState() => _SectAboutState();
}

class _SectAboutState extends State<SectAbout> {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: Utility.screenHeight(context),    
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,      
        children: <Widget>[
          Text("About me"),        
        ],
      ),
    );
  }
}
