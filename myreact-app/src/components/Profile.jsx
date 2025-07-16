import { Award, Bell, Briefcase, Calendar, Camera, DollarSign, Edit3, Mail, MapPin, Phone, Save, Star, Target, User, Smartphone, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './Profile.css';
import axios from 'axios'; // <-- Add this import

const Profile = () => {
  // Initialize user data from localStorage or defaults
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    annualSavingsAmount: 0,
    occupation: '',
    profileImage: '',
    dateOfBirth: '',
    monthlyIncome: 0,
    preferredCurrency: 'INR', // Match your backend default
    financialGoal: '',
    joinDate: '',
    membershipLevel: 'Basic',
    bio: '',
  });

  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('financial');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    mobileNotifications: true,
  });

  // Financial summary data from localStorage
  const [financialData, setFinancialData] = useState({
    totalSaved: 0,
    savingsGoal: 0,
    monthlySpent: 0,
    savingsRate: 0,
  });

  // Only these four badges, all start as not earned
  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Savings Champion', description: 'Maintained 60%+ savings rate for 6 months', icon: '🏆', earned: false },
    { id: 2, title: 'Budget Master', description: 'Stayed within budget for 12 consecutive months', icon: '📊', earned: false },
    { id: 3, title: 'Goal Achiever', description: 'Reached 90% of annual savings goal', icon: '🎯', earned: false },
    { id: 4, title: 'First Month', description: 'Completed your first month on Wealth Pulse!', icon: '🌟', earned: false },
  ]);

  // Load data from backend and localStorage on component mount
  useEffect(() => {
    loadUserData();
    loadFinancialData();
    loadAchievements();
    loadSettings();
    checkLoginStatus();
    setDataLoaded(true);
    // eslint-disable-next-line
  }, []);

  // Save user data to backend and localStorage whenever user state changes
  useEffect(() => {
    if (dataLoaded) saveUserData();
    // eslint-disable-next-line
  }, [user, dataLoaded]);

  // Save financial data to localStorage whenever it changes
  useEffect(() => {
    if (dataLoaded) saveFinancialData();
    // eslint-disable-next-line
  }, [financialData, dataLoaded]);

  // Save achievements to localStorage whenever they change
  useEffect(() => {
    if (dataLoaded) saveAchievements();
    // eslint-disable-next-line
  }, [achievements, dataLoaded]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (dataLoaded) saveSettings();
    // eslint-disable-next-line
  }, [settings, dataLoaded]);

  const checkLoginStatus = () => {
    const hasBasicInfo = localStorage.getItem('userName') || localStorage.getItem('userEmail');
    setIsLoggedIn(!!hasBasicInfo);
  };

  // Fetch user profile from backend, fallback to localStorage if not found
  const loadUserData = async () => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile/${email}`);
        if (res.data) {
          setUser(prev => ({
          ...prev,
          ...res.data,
          email // <-- Always set email from localStorage
        }));
        return;
        }
      } catch (err) {
        // fallback to localStorage if backend fails
      }
    }
    // fallback to localStorage
    const savedUser = {
      name: localStorage.getItem('userName') || '',
      email: localStorage.getItem('userEmail') || '',
      phone: localStorage.getItem('userPhone') || '',
      address: localStorage.getItem('userAddress') || '',
      annualSavingsAmount: parseInt(localStorage.getItem('userAnnualSavingsAmount')) || 0,
      occupation: localStorage.getItem('userOccupation') || '',
      profileImage: localStorage.getItem('profileImage') || '',
      dateOfBirth: localStorage.getItem('userDateOfBirth') || '',
      monthlyIncome: parseInt(localStorage.getItem('userMonthlyIncome')) || 0,
      preferredCurrency: localStorage.getItem('userCurrency') || 'INR',
      financialGoal: localStorage.getItem('userFinancialGoal') || '',
      joinDate: localStorage.getItem('userJoinDate') || new Date().toISOString().split('T')[0],
      membershipLevel: localStorage.getItem('userMembershipLevel') || 'Basic',
      bio: localStorage.getItem('userBio') || '',
    };
    setUser(prev => ({
    ...prev,
    ...savedUser,
    email // <-- Always set email from localStorage
  }));
  };

  const loadFinancialData = () => {
    const savedFinancialData = {
      totalSaved: parseInt(localStorage.getItem('totalSaved')) || 0,
      savingsGoal: parseInt(localStorage.getItem('savingsGoal')) || 0,
      monthlySpent: parseInt(localStorage.getItem('monthlySpent')) || 0,
      savingsRate: parseFloat(localStorage.getItem('savingsRate')) || 0,
    };
    setFinancialData(savedFinancialData);
  };

  const loadAchievements = () => {
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  };

  const loadSettings = () => {
    const savedSettings = {
      emailNotifications: localStorage.getItem('emailNotifications') === 'true',
      mobileNotifications: localStorage.getItem('mobileNotifications') === 'true',
    };
    setSettings(savedSettings);
  };

  // Save user profile to backend and localStorage
  const saveUserData = async () => {
    // Save to backend
    try {
      await axios.post('http://localhost:5000/api/profile', user);
    } catch (err) {
      // handle error if needed
    }
    // Save to localStorage (for offline/caching)
    Object.keys(user).forEach(key => {
      if (key === 'monthlyIncome' || key === 'annualSavingsAmount') {
        localStorage.setItem(`user${key.charAt(0).toUpperCase() + key.slice(1)}`, user[key].toString());
      } else {
        localStorage.setItem(`user${key.charAt(0).toUpperCase() + key.slice(1)}`, user[key]);
      }
    });
  };

  const saveFinancialData = () => {
    Object.keys(financialData).forEach(key => {
      localStorage.setItem(key, financialData[key].toString());
    });
  };

  const saveAchievements = () => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  };

  const saveSettings = () => {
    localStorage.setItem('emailNotifications', settings.emailNotifications.toString());
    localStorage.setItem('mobileNotifications', settings.mobileNotifications.toString());
  };

  const toggleEdit = () => setEditing(!editing);

  const handleInputChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
    setUser({ ...user, [e.target.name]: value });
  };

  const handleSettingToggle = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setUser({ ...user, profileImage: '' });
  };

  const exportData = async (format) => {
  // Get the logged-in user's username (or identifier)
  const username = localStorage.getItem('username');

  // Fetch expenses for this user from backend
  let expenses = [];
  try {
    const res = await axios.get(`http://localhost:5000/api/expenses/user/${encodeURIComponent(username)}`);
    expenses = res.data; // Should be an array of {category, amount, date}
  } catch (err) {
    alert('Failed to fetch expenses for export.');
    return;
  }

  // Prepare rows: Category, Amount, Date
  const csvData = [
    ['Category', 'Amount', 'Date']
  ];
  let overallTotal = 0;

  expenses.forEach(exp => {
    csvData.push([
      exp.category,
      `₹${Number(exp.amount).toFixed(2)}`,
      exp.date ? new Date(exp.date).toLocaleDateString() : ''
    ]);
    overallTotal += Number(exp.amount);
  });

  // Add overall total row
  csvData.push(['Overall Total', `₹${overallTotal.toFixed(2)}`, '']);

  const csvContent = csvData.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = format === 'csv' ? 'categories_data.csv' : 'categories_data.xlsx';
  a.click();
  URL.revokeObjectURL(url);
  return;
};

  const getMembershipBadge = () => {
    switch(user.membershipLevel) {
      case 'Premium': return { color: 'bg-gradient-to-r from-yellow-400 to-orange-500', text: 'Premium' };
      case 'Gold': return { color: 'bg-gradient-to-r from-yellow-500 to-yellow-600', text: 'Gold' };
      default: return { color: 'bg-gradient-to-r from-gray-400 to-gray-500', text: 'Basic' };
    }
  };

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg' 
          : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
      }`}
    >
      {label}
    </button>
  );

  const isProfileIncomplete = () => {
    return !user.name || !user.email || !user.phone || user.monthlyIncome === 0;
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        {/* Animated Background Elements */}
        <div className="background-animation">
          <div className="floating-orb floating-orb-1"></div>
          <div className="floating-orb floating-orb-2"></div>
        </div>

        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="main-title">
                Profile Dashboard
              </h1>
              <p className="subtitle">Manage your personal information and track your financial journey</p>
              {isProfileIncomplete() && (
                <div className="incomplete-notice">
                  <Bell size={16} />
                  <span>Complete your profile to unlock all features</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="content-grid">
            {/* Profile Card */}
            <div className="profile-card-container">
              <div className="profile-card">
                {/* Profile Header with Dynamic Gradient */}
                <div className="profile-card-header">
                  <div className="profile-header-overlay"></div>
                  <div className="profile-header-content">
                    <div className="profile-image-container">
                      <div className="profile-image">
                        {user.profileImage ? (
                          <img 
                            src={user.profileImage} 
                            alt="Profile" 
                            className="profile-img"
                          />
                        ) : (
                          <div className="profile-placeholder">
                            {user.name ? user.name.charAt(0).toUpperCase() : <User size={48} />}
                          </div>
                        )}
                      </div>
                      {editing && (
                        <label className="image-upload-btn">
                          <Camera size={16} />
                          <input
                            type="file"
                            className="hidden-input"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>
                    <h2 className="profile-name">
                      {user.name || 'Set Your Name'}
                    </h2>
                    <p className="profile-occupation">{user.occupation || 'Add your occupation'}</p>
                    <div className={`membership-badge ${getMembershipBadge().color}`}>
                      <Star size={14} />
                      {getMembershipBadge().text} Member
                    </div>
                    {user.profileImage && editing && (
                      <button 
                        onClick={removeProfileImage} 
                        className="remove-photo-btn"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
                <div className="profile-card-body">
                  {user.bio && !editing && (
                    <div className="bio-section">
                      <p className="bio-text">{user.bio}</p>
                    </div>
                  )}
                  {editing ? (
                    <div className="edit-form">
                      <div className="form-group">
                        <label className="form-label">Name<span style={{color: 'red'}}>*</span></label>
                        <div className="input-container">
                          <User className="input-icon" />
                          <input
                            name="name"
                            value={user.name}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Enter your name"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email<span style={{color: 'red'}}>*</span></label>
                        <div className="input-container">
                          <Mail className="input-icon" />
                          <input
                            name="email"
                            type="email"
                            value={user.email}
                            className="form-input"
                            readOnly
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone<span style={{color: 'red'}}>*</span></label>
                        <div className="input-container">
                          <Phone className="input-icon" />
                          <input
                            name="phone"
                            value={user.phone}
                            onChange={handleInputChange}
                            className="form-input"
                            readOnly
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Address<span style={{color: 'red'}}>*</span></label>
                        <div className="input-container">
                          <MapPin className="input-icon" />
                          <textarea
                            name="address"
                            value={user.address}
                            onChange={handleInputChange}
                            className="form-textarea"
                            placeholder="Enter your address"
                            rows="2"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Annual Savings Amount (₹)<span style={{color: 'red'}}>*</span></label>
                        <div className="input-container">
                          <input
                            name="annualSavingsAmount"
                            type="number"
                            value={user.annualSavingsAmount}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Enter annual savings amount"
                            required
                            min={1}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Occupation</label>
                        <div className="input-container">
                          <Briefcase className="input-icon" />
                          <input
                            name="occupation"
                            value={user.occupation}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Enter your occupation"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Bio</label>
                        <textarea
                          name="bio"
                          value={user.bio}
                          onChange={handleInputChange}
                          className="form-textarea"
                          placeholder="Tell us about yourself..."
                          rows="3"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date of Birth<span style={{color: 'red'}}>*</span></label>
                        <div className="input-container">
                          <Calendar className="input-icon" />
                          <input
                            name="dateOfBirth"
                            type="date"
                            value={user.dateOfBirth}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Monthly Income (₹)<span style={{color: 'red'}}>*</span></label>
                        <div className="input-container">
                          <input
                            name="monthlyIncome"
                            type="number"
                            value={user.monthlyIncome}
                            onChange={handleInputChange}
                            className="form-input"
                            readOnly
                            required
                            min={1}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date of Joining<span style={{color: 'red'}}>*</span></label>
                        <div className="input-container">
                          <Calendar className="input-icon" />
                          <input
                            name="joinDate"
                            type="date"
                            value={user.joinDate}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Financial Goal</label>
                        <textarea
                          name="financialGoal"
                          value={user.financialGoal}
                          onChange={handleInputChange}
                          className="form-textarea"
                          placeholder="Describe your financial goals..."
                          rows="2"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Membership Level<span style={{color: 'red'}}>*</span></label>
                        <select
                          name="membershipLevel"
                          value={user.membershipLevel}
                          onChange={handleInputChange}
                          className="form-select"
                          required
                        >
                          <option value="Basic">Basic</option>
                          <option value="Premium">Premium</option>
                          <option value="Gold">Gold</option>
                        </select>
                      </div>
                      <button 
                        onClick={async () => {
                        await saveUserData();
                        toggleEdit();
                  }} 
                      className="save-btn"
                 >
                      <Save size={16} /> Save Changes
                      </button>
                    </div>
                  ) : (
                    <div className="profile-info">
                      {[
                        { icon: Mail, label: 'Email', value: user.email },
                        { icon: Phone, label: 'Phone', value: user.phone },
                        { icon: MapPin, label: 'Address', value: user.address },
                        { icon: DollarSign, label: 'Annual Savings Amount', value: user.annualSavingsAmount ? `₹${user.annualSavingsAmount.toLocaleString()}` : '' },
                        { icon: Briefcase, label: 'Occupation', value: user.occupation },
                        { icon: Calendar, label: 'Date of Birth', value: user.dateOfBirth },
                        { icon: Calendar, label: 'Date of Joining', value: user.joinDate },
                        { icon: DollarSign, label: 'Monthly Income', value: user.monthlyIncome ? `₹${user.monthlyIncome.toLocaleString()}` : '' },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="info-item">
                          <div className="info-icon">
                            <Icon size={16} />
                          </div>
                          <div className="info-content">
                            <p className="info-label">{label}</p>
                            <p className="info-value">{value || 'Not set'}</p>
                          </div>
                        </div>
                      ))}
                      {user.financialGoal && (
                        <div className="goal-section">
                          <p className="goal-label">Financial Goal</p>
                          <p className="goal-text">{user.financialGoal}</p>
                        </div>
                      )}
                      <button 
                        onClick={toggleEdit} 
                        className="edit-btn"
                      >
                        <Edit3 size={16} /> Edit Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Main Content */}
            <div className="dashboard-content">
              {/* Navigation Tabs */}
              <div className="tabs-container">
                <div className="tabs">
                  <TabButton id="financial" label="Financial" isActive={activeTab === 'financial'} onClick={setActiveTab} />
                  <TabButton id="achievements" label="Achievements" isActive={activeTab === 'achievements'} onClick={setActiveTab} />
                  <TabButton id="settings" label="Settings" isActive={activeTab === 'settings'} onClick={setActiveTab} />
                </div>
              </div>
              {/* Tab Content */}
              {activeTab === 'financial' && (
                <div className="tab-content">
                  {/* Only show the progress bar */}
                  <div className="goal-progress-card">
                    <div className="goal-header">
                      <Target className="goal-icon" />
                      <h3 className="goal-title">Financial Goal Progress</h3>
                    </div>
                    <div className="goal-content">
                      <div className="goal-stats">
                        <span className="goal-stat-label">Annual Savings Goal</span>
                        <span className="goal-stat-value">
                          ₹{financialData.totalSaved.toLocaleString()} / ₹{user.annualSavingsAmount ? user.annualSavingsAmount.toLocaleString() : '0'}
                      </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${user.annualSavingsAmount > 0 ? (financialData.totalSaved / user.annualSavingsAmount) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      {user.financialGoal && (
                        <p className="goal-description">{user.financialGoal}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'achievements' && (
                <div className="achievements-card">
                  <div className="achievements-header">
                    <Award className="achievements-icon" />
                    <h3 className="achievements-title">Achievements</h3>
                  </div>
                  <div className="achievements-grid">
                    {achievements.filter(a => a.earned).length === 0 ? (
                      <div style={{ color: "#888", fontStyle: "italic", padding: "2rem", textAlign: "center", width: "100%" }}>
                        No badges earned yet.
                      </div>
                    ) : (
                      achievements.filter(a => a.earned).map((achievement) => (
                        <div 
                          key={achievement.id} 
                          className={`achievement-item achievement-earned`}
                          title={achievement.description}
                        >
                          <div className="achievement-content">
                            <div className="achievement-icon">{achievement.icon}</div>
                            <div className="achievement-info">
                              <h4 className="achievement-name">{achievement.title}</h4>
                              <p className="achievement-desc">{achievement.description}</p>
                              <div className="achievement-status">✓ Earned</div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="settings-card">
                  <h3 className="settings-title">Account Settings</h3>
                  <div className="settings-list">
                    {/* Email Notifications */}
                    <div className="setting-item">
                      <div className="setting-info">
                        <div className="setting-icon">
                          <Bell size={20} />
                        </div>
                        <div className="setting-content">
                          <div className="setting-text">
                            <h4 className="setting-name">Email Notifications</h4>
                            <p className="setting-desc">Receive email updates about your financial progress</p>
                          </div>
                          <button
                            onClick={() => handleSettingToggle('emailNotifications')}
                            className={`toggle-btn ${settings.emailNotifications ? 'toggle-active' : 'toggle-inactive'}`}
                          >
                            {settings.emailNotifications ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Mobile Notifications */}
                    <div className="setting-item">
                      <div className="setting-info">
                        <div className="setting-icon">
                          <Smartphone size={20} />
                        </div>
                        <div className="setting-content">
                          <div className="setting-text">
                            <h4 className="setting-name">Mobile Notifications</h4>
                            <p className="setting-desc">Get push notifications on your mobile device</p>
                          </div>
                          <button
                            onClick={() => handleSettingToggle('mobileNotifications')}
                            className={`toggle-btn ${settings.mobileNotifications ? 'toggle-active' : 'toggle-inactive'}`}
                          >
                            {settings.mobileNotifications ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Data Export */}
                    <div className="setting-item">
                      <div className="setting-info">
                        <div className="setting-icon">
                          <Download size={20} />
                        </div>
                        <div className="setting-content">
                          <div className="setting-text">
                            <h4 className="setting-name">Data Export</h4>
                            <p className="setting-desc">Download your profile and financial data</p>
                          </div>
                          <div className="export-buttons">
                            <button 
                              onClick={() => exportData('csv')}
                              className={`toggle-btn toggle-active`}
                              style={{minWidth: 120}}
                            >
                              Export as CSV
                            </button>
                            <button 
                              onClick={() => exportData('excel')}
                              className={`toggle-btn toggle-active`}
                              style={{minWidth: 120}}
                            >
                              Export as Excel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Badges */}
                    <div className="setting-item">
                      <div className="setting-info">
                        <div className="setting-icon">
                          <Award size={20} />
                        </div>
                        <div className="setting-content">
                          <div className="setting-text">
                            <h4 className="setting-name">Badges</h4>
                            <p className="setting-desc">Your progress badges</p>
                          </div>
                          <div className="achievements-grid settings-badges-grid">
                            {achievements.map((achievement) => (
                              <div 
                                key={achievement.id} 
                                className={`achievement-item settings-badge-card`}
                                title={achievement.description}
                              >
                                <div className="achievement-content">
                                  <div className="achievement-icon">{achievement.icon}</div>
                                  <div className="achievement-info">
                                    <h4 className="achievement-name">{achievement.title}</h4>
                                    <p className="achievement-desc">{achievement.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Reset Profile */}
                    <div className="setting-item">
                      <div className="setting-info">
                        <div className="setting-icon">
                          <Star size={20} />
                        </div>
                        <div className="setting-content">
                          <div className="setting-text">
                            <h4 className="setting-name">Reset Profile</h4>
                            <p className="setting-desc">This will permanently delete all your data</p>
                          </div>
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to reset your profile? This action cannot be undone.')) {
                                localStorage.clear();
                                window.location.reload();
                              }
                            }}
                            className={`toggle-btn toggle-inactive`}
                            style={{background: 'linear-gradient(135deg, #ef4444, #f59e42)', color: 'white', minWidth: 120}}
                          >
                            Reset Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
  };
  export default Profile;
