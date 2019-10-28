import 'package:flutter/material.dart';
import 'package:ts_portfolio/utility.dart';

class SectResume extends StatefulWidget {
  SectResume({Key key}) : super(key: key);

  @override
  _SectResumeState createState() => _SectResumeState();
}

class _SectResumeState extends State<SectResume> {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: Utility.screenHeight(context),    
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,      
        children: <Widget>[
          Text("Resume"),        
        ],
      ),
    );
  }
}
