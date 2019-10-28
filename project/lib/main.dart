import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:ts_portfolio/page.dart';
import 'package:ts_portfolio/s_intro.dart';
import 'package:ts_portfolio/s_about.dart';
import 'package:ts_portfolio/s_projects.dart';
import 'package:ts_portfolio/s_resume.dart';

//palette : ffe74c, ff5964, ffffff, 6bf178, 35a7ff

void main() {
  debugPaintSizeEnabled = false;
  runApp(Main());
}

class Main extends StatelessWidget {
  // This widget is the root of your application.
  MyPageView _page; // build below

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Terence Sim\'s Portfolio',
      theme: ThemeData(
        backgroundColor: const Color(0xffffffff),
        primarySwatch: Colors.indigo,
        fontFamily: "GoogleSans",
      ),
      home: Scaffold(
        backgroundColor: const Color(0xffffffff),
        appBar: _buildAppBar(),
        body: _buildScrollView(),
      ),
    );
  }

  Widget _buildAppBar() {
    return AppBar(   
      titleSpacing: 0,   
      title: Container(                                      
        child: _helperMenuBtn("_icon", 0),
      ),
      elevation: 0.0,
      actions: <Widget>[
        _helperMenuBtn("About", 1),
        _helperMenuBtn("Projects", 2),
        Padding(
          padding: EdgeInsets.only(right: 15),
          child: _helperMenuBtn("Resume", 3),
        ),
      ],
    );
  }

  Widget _buildScrollView() {
    _page = MyPageView(
      children: <Widget>[
        SectIntro(),
        SectAbout(),
        SectProjects(),
        SectResume(),
      ],
    );

    return _page;
  }

  Widget _helperMenuBtn(final String text, final int page) {
    return Container(
      padding: EdgeInsets.only(top: 10, bottom: 10),
      child: FlatButton(
        onPressed: () => _page.state.scrollTo(page),
        child: text != "_icon"
            ? Text(
                text,
                textScaleFactor: 1.1,
              )
            : Icon(
                Icons.donut_small,
                size: 40,
              ),
        textColor: Colors.white,
      ),
    );
  }
}
