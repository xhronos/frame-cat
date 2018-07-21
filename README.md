# frame-cat

Tool for concatenating text frame data.

[![Build Status via Travis CI](https://travis-ci.org/xhronos/frame-cat.svg?branch=master)](https://travis-ci.org/xhronos/frame-cat)

Installation
------------

    npm install --save frame-cat

Usage
-----

The `frame-cat` tool can be used to concatenate frame data files.

Example to concatenate `additional.txt` to `complete.txt`:

```bash
frame-cat -a -r complete.txt additional.txt
```


Data Format
-----------

The frame data must be provided as text files which has these minimum requirements:
* lines starting with `#` are ignored
* one space-delimited header line
* frame data lines must start with a floating point value, which normally denotes the relative time in seconds

Example: *Posture Trajectory format* as saved by the *ICSPACE MotionAnalyzer*:

```
#Posture Trajectory saved by ICSPACE MotionAnalyzer.
#
#File format version: nA
#First row: list of joints separated by ' ' used in this animation. See Documentation for hierarchy information.
#Data:
#	 timestamp (optional, 0 if not set.) followed by ','
#	 root translation (coordinates separated by ' ', followed by ',')
#	 joint rotations (quaternions, local w.r.t hierarchy) (in form of 'w1 x1 y1 z1, w2 x2 y2 z2, ...)
#	 joint translations (global w.r.t. to root of world - see Documentation of protocol buffers) (coordinates separated by ' ', each rotation separated by ',')
#	 metadata separated by ' '
HumanoidRoot vl5 vt10 vc7 skullbase l_sternoclavicular l_shoulder l_elbow l_wrist r_sternoclavicular r_shoulder r_elbow r_wrist joint1 l_hip l_knee l_ankle r_hip r_knee r_ankle
0.0,0.0 0.0 0.0,0.999925 0.011045 0.005262 0.000348,1.0 0.0 0.0 0.0,0.999864 -0.015507 -0.003853 0.004059,1.0 0.0 0.0 0.0,0.999968 0.00682 -0.004004 -0.001318,1.0 0.0 0.0 0.0,0.711019 0.007341 -9e-05 -0.703134,0.491553 0.515319 -0.496958 0.495838,0.706838 -0.707337 -0.007238 -0.001355,1.0 0.0 0.0 0.0,0.704825 0.003048 -0.005005 0.709357,0.500713 0.49853 0.503439 -0.497296,0.707814 -0.706268 -0.008638 -0.010521,0.013838 0.010586 0.004195 -0.999839,0.999987 -0.000575 0.003223 0.003785,0.999944 -0.007379 -0.007352 -0.001836,0.999988 -0.001833 -0.004557 -0.000813,0.999997 -0.001815 5.1e-05 0.001823,0.999956 -0.004769 -0.006938 0.004119,0.99997 -0.004116 0.002406 -0.006051,;MP:,PSPS:,Action:MA_Not_Annotated
0.007,0.0 0.0 0.0,0.999924 0.011113 0.005402 0.000223,1.0 0.0 0.0 0.0,0.99986 -0.015597 -0.004105 0.00442,1.0 0.0 0.0 0.0,0.999967 0.00701 -0.003892 -0.001556,1.0 0.0 0.0 0.0,0.710999 0.007428 -0.000287 -0.703154,0.491553 0.5154 -0.496779 0.495933,0.706701 -0.707477 -0.0069 -0.001357,1.0 0.0 0.0 0.0,0.704811 0.003195 -0.004906 0.709371,0.500629 0.498703 0.503234 -0.497414,0.70782 -0.706261 -0.008685 -0.010533,0.013899 0.010516 0.004209 -0.999839,0.999987 -0.000627 0.003066 0.004059,0.999943 -0.007397 -0.007398 -0.001941,0.999988 -0.001918 -0.004435 -0.001016,0.999997 -0.00198 -3.6e-05 0.001743,0.999953 -0.004689 -0.007161 0.00445,0.999968 -0.004076 0.002653 -0.006362,;MP:,PSPS:,Action:MA_Not_Annotated
```
