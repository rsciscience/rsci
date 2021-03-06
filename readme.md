
   )    
  (__   
  _  )_ 
 (_)_(_)
  (o o)
==\\o/==

RSCI is a RaspberryPi-based operant box solution. The system can run mutiple behavioral paradigms using a touch screen interface. 

The system is configured to run multiple animals connected to a single server with a dash board web page, allowing for unprecedented loading of multiple boxes, adjustment of protocols, and streamlining of data collection, the system supports mutiple paradigms with a custom loading module making this is the first open source operant box solution that promotes not only the best behavioral research, but the evolution of these tasks by different labs. 



______________________________
Requirements:
______________________________

virtual-box
raspbian stretch linux distro
node >  8
mongo
git
arp-scan


______________________________
VM setup:
______________________________

Setting Up VM with Debian:

DL virtual box

New	- add name - linux - other 32-bit

create virtual hard disk, type = VDI, storage = Dynamically allocated

Then: go to Storage tab and add Optical Disk existing image 2017-11-16-rpd-x86-stretch.iso
    (dl’d from https://www.raspberrypi.org/downloads/raspberry-pi-desktop/)

Then: go to Network tab and set attached to: Bridged adapter 
    (so that we aren’t NAT’d and we can see and talk to either other on the network)

Then Start VM, install and run defaults except with rooter step

Optional, Makes it easier to work on VM headless:
Set up ssh: ifconfig on pi to get ip address
on local machine run ssh pi@ip address - now you can run commands for the pi on local machine

______________________________
Application Setup:
______________________________

install node on pi
https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions

curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

Mongo:
sudo apt-get install mongodb-server

Update all packages:
sudo apt-get update
sudo apt-get upgrade
sudo apt-get  (???)

other dependencies to install:
sudo apt-get install arp-scan (scans network to see what devices are available, requires sudo?)
sudo apt-get install build-essential (already in pi)

clone git repo:
git clone https://github.com/rsciscience/rsci.git 

npm install in pi work/rsci and work/rsci/rsci_ui
