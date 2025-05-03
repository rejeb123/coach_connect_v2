
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                C
              </div>
              <span className="text-xl font-bold text-gray-900">CoachConnect</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Connecting coaches and clients for personalized fitness journeys.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-base text-gray-600 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/coaches" className="text-base text-gray-600 hover:text-primary">
                  Find Coaches
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-base text-gray-600 hover:text-primary">
                  Become a Coach
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/blog" className="text-base text-gray-600 hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-base text-gray-600 hover:text-primary">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-base text-gray-600 hover:text-primary">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/privacy" className="text-base text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} CoachConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
