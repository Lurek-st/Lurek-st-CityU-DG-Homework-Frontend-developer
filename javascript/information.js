// Use ES6 Class to manage promotional messages
class PromotionManager {
  constructor() {
    // Use Map to store messages and their states
    this.messages = new Map([
      ['tech', "Join our company in Technology Zone of Visionary Innovation Hub for unparalleled opportunities in cutting-edge tech development! 15 QUOTAS LEFT!"],
      ['innovation', "Become part of the Innovation Zone at Visionary Innovation Hub, where creativity meets research for groundbreaking solutions! 10 QUOTAS LEFT!"],
      ['eco', "Discover the Eco Zone at Visionary Innovation Hub, dedicated to sustainable practices and technologies for a greener future! 12 QUOTAS LEFT!"]
    ]);

    this.currentMessageIndex = 0;
    this.currentMessageElement = null;
    this.isAnimating = false;
    this.promotionBlock = document.getElementById('promotion-block');

    // Convert messages to array for looping
    this.promotionalMessages = Array.from(this.messages.values());
  }

  getRandomIndex() {
    return Math.floor(Math.random() * this.promotionalMessages.length);
  }

  createMessageElement(message) {
    const element = document.createElement('div');
    element.className = 'message';
    element.textContent = message;
    return element;
  }

  displayMessage() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const newMessageElement = this.createMessageElement(this.promotionalMessages[this.currentMessageIndex]);

    if (this.currentMessageElement) {
      this.currentMessageElement.classList.add('fade-out');

      // Use Promise to handle animation
      new Promise(resolve => {
        setTimeout(resolve, 500);
      }).then(() => {
        if (this.currentMessageElement?.parentNode) {
          this.promotionBlock.removeChild(this.currentMessageElement);
        }
        this.promotionBlock.appendChild(newMessageElement);
        void newMessageElement.offsetWidth;
        newMessageElement.classList.add('active');
        this.currentMessageElement = newMessageElement;
        this.isAnimating = false;
      });
    } else {
      this.promotionBlock.appendChild(newMessageElement);
      void newMessageElement.offsetWidth;
      newMessageElement.classList.add('active');
      this.currentMessageElement = newMessageElement;
      this.isAnimating = false;
    }
  }

  updateMessage() {
    this.currentMessageIndex = (this.currentMessageIndex + 1) % this.promotionalMessages.length;
    this.displayMessage();
  }

  initialize() {
    this.currentMessageIndex = this.getRandomIndex();
    this.displayMessage();
    setInterval(() => this.updateMessage(), 3500);
  }
}

// Use ES6 Class to manage video playback
class VideoManager {
  constructor() {
    this.video = document.getElementById('cycleVideo');
    // Use Set to store video URLs
    this.videoUrls = new Set([
      'http://cs2204.cityu-dg.local/~instructor/video/video1.mp4',
      'http://cs2204.cityu-dg.local/~instructor/video/video2.mp4'
    ]);
    this.currentVideoIndex = 0;
    this.videoArray = Array.from(this.videoUrls);

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add event listener using HTML method (Method 1)
    this.video.setAttribute('onended', 'handleVideoEnd()');

    // Add event listener using JavaScript method (Method 2)
    this.video.addEventListener('error', this.handleVideoError.bind(this));
  }

  handleVideoEnd() {
    this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videoArray.length;
    this.updateVideoSource();
  }

  handleVideoError(error) {
    console.error('Video playback error:', error);
    this.handleVideoEnd(); // Try to play next video
  }

  updateVideoSource() {
    this.video.innerHTML = `<source src="${this.videoArray[this.currentVideoIndex]}" type="video/mp4">`;
    this.video.load();
    this.video.play().catch(error => {
      console.error('Video autoplay failed:', error);
    });
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  const promotionManager = new PromotionManager();
  const videoManager = new VideoManager();

  // Initialize promotional messages
  promotionManager.initialize();

  // Provide global function for HTML event handling
  window.handleVideoEnd = () => {
    videoManager.handleVideoEnd();
  };
});