import 'package:flutter/material.dart';
import 'package:ts_portfolio/utility.dart';

class SectProjects extends StatefulWidget {
  SectProjects({Key key}) : super(key: key);

  @override
  _SectProjectsState createState() => _SectProjectsState();
}

class _SectProjectsState extends State<SectProjects> {
 @override
  Widget build(BuildContext context) {
    return Container(
      height: Utility.screenHeight(context),    
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,      
        children: <Widget>[
          Text("Projects"),        
        ],
      ),
    );
  }
}