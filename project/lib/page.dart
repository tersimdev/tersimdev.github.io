import 'package:flutter/material.dart';

class MyPageView extends StatefulWidget {
  MyPageView({Key key, this.children}) : super(key: key);

  final List<Widget> children;
  _MyPageViewState state;

  @override
  _MyPageViewState createState() => state = _MyPageViewState();
}

class _MyPageViewState extends State<MyPageView> {
  PageController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = PageController();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scrollbar(      
      child: PageView(
        controller: _ctrl,
        scrollDirection: Axis.vertical,
        children: widget.children,
      ),
    );
  }

  void scrollTo(int page) {
    setState(() {
      _ctrl.animateToPage(
        page,
        duration: Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    });
  }
}
