import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Mtitle from "/src/components library/Mtitle";
import { AuthContext } from "../../../providers/AuthProvider";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";

const AutomatedReminders = () => {
  const { branch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const axiosSecure = UseAxiosSecure();
  // State to store form values
  const [expirationTemplate60Days, setExpirationTemplate60Days] = useState("");
  const [expirationEnabled60Days, setExpirationEnabled60Days] = useState(false);

  const [birthdayTemplate, setBirthdayTemplate] = useState("");
  const [birthdayEnabled, setBirthdayEnabled] = useState(false);

  const [renewalTemplate, setRenewalTemplate] = useState("");
  const [renewalEnabled, setRenewalEnabled] = useState(false);

  // Fetch existing email settings on component mount
  useEffect(() => {
    const fetchEmailSettings = async () => {
      try {
        const response = await axiosSecure.get(
          `/branches/${branch}/email-settings`
        );

        if (response.status === 200) {
          const {
            expirationReminder60Days,
            birthdayWishes,
            subscriptionRenewalReminder,
          } = response.data;
          // Set the state with the fetched data
          setExpirationTemplate60Days(expirationReminder60Days.template);
          setExpirationEnabled60Days(expirationReminder60Days.enabled);

          setBirthdayTemplate(birthdayWishes.template);
          setBirthdayEnabled(birthdayWishes.enabled);

          setRenewalTemplate(subscriptionRenewalReminder.template);
          setRenewalEnabled(subscriptionRenewalReminder.enabled);
        }
      } catch (err) {
        console.error("Failed to fetch email settings:", err);
      }
    };

    if (branch) {
      fetchEmailSettings();
    }
  }, [branch]);

  // Handle form submission
  const handleSaveSettings = async (event) => {
    event.preventDefault();
    setLoading(true);

    const emailSettings = {
      expirationReminder60Days: {
        template: expirationTemplate60Days,
        enabled: expirationEnabled60Days,
      },
      birthdayWishes: {
        template: birthdayTemplate,
        enabled: birthdayEnabled,
      },
      subscriptionRenewalReminder: {
        template: renewalTemplate,
        enabled: renewalEnabled,
      },
    };

    try {
      const response = await axiosSecure.put(
        `/branches/${branch}/email-settings`,
        { emailSettings }
      );
      if (response.status === 200) {
        alert("Settings saved successfully!");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save settings. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Page Title */}
      <Mtitle title="Automated Reminders Settings" />

      {/* Reminder Settings Section */}
      <div className="mt-6 bg-white shadow-lg rounded-lg p-8">
        <form className="space-y-6" onSubmit={handleSaveSettings}>
          {/* Expiration Reminder (60 Days) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Expiration Reminder (60 Days)
            </h3>
            <div className="flex flex-col lg:flex-row lg:space-x-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Email Template
                </label>
                <textarea
                  placeholder="Write your email template for Expiration Reminder (60 Days)"
                  className="textarea textarea-bordered w-full"
                  rows="3"
                  value={expirationTemplate60Days}
                  onChange={(e) => setExpirationTemplate60Days(e.target.value)}
                ></textarea>
              </div>
              <div className="flex items-center mt-4 lg:mt-0">
                <span className="mr-2">Enable:</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={expirationEnabled60Days}
                  onChange={(e) => setExpirationEnabled60Days(e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Birthday Wishes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Birthday Wishes</h3>
            <div className="flex flex-col lg:flex-row lg:space-x-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Email Template
                </label>
                <textarea
                  placeholder="Write your email template for Birthday Wishes"
                  className="textarea textarea-bordered w-full"
                  rows="3"
                  value={birthdayTemplate}
                  onChange={(e) => setBirthdayTemplate(e.target.value)}
                ></textarea>
              </div>
              <div className="flex items-center mt-4 lg:mt-0">
                <span className="mr-2">Enable:</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={birthdayEnabled}
                  onChange={(e) => setBirthdayEnabled(e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Subscription Renewal Reminder */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Subscription Renewal Reminder
            </h3>
            <div className="flex flex-col lg:flex-row lg:space-x-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Email Template
                </label>
                <textarea
                  placeholder="Write your email template for Subscription Renewal Reminder"
                  className="textarea textarea-bordered w-full"
                  rows="3"
                  value={renewalTemplate}
                  onChange={(e) => setRenewalTemplate(e.target.value)}
                ></textarea>
              </div>
              <div className="flex items-center mt-4 lg:mt-0">
                <span className="mr-2">Enable:</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={renewalEnabled}
                  onChange={(e) => setRenewalEnabled(e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="btn btn-primary w-full lg:w-auto flex justify-center items-center gap-3"
              disabled={loading}
            >
              {loading && (
                <span className="loading loading-spinner loading-md"></span>
              )}
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AutomatedReminders;
