  .then((data) => {
    if (data.success) {
      setSuccess("Preferences saved successfully!");
      setError(null);
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('preferencesUpdated'));
    } else {
      setError(data.error || "Failed to save preferences");
      setSuccess(null);
    }
  }) 