const supabase = require('../../config/supabaseClient');

exports.createEmployee = async (req, res) => {
  try {
    const {
      // Step 1: Basic Information
      first_name,
      middle_name,
      last_name,
      emp_code,
      dob,
      doj,
      confirmation_date,
      gender,
      blood_group,
      marital_status,
      email,
      mobile,
      
      // Step 2: Employee Position
      division,
      cost_center,
      grade,
      designation,
      location,
      department,
      shift,
      
      // Step 3: Statutory Info
      pan_number,
      include_pf,
      include_esi,
      include_lwf,
      pf_number,
      uan_number,
      pf_excess_contribution,
      
      // Step 4: Payment Mode
      payment_type
    } = req.body;

    // Insert into Supabase 'employees' table
    const { data, error } = await supabase
      .from('employees')
      .insert([
        {
          first_name,
          middle_name,
          last_name,
          emp_code,
          dob,
          doj,
          confirmation_date,
          gender,
          blood_group,
          marital_status,
          email,
          mobile,
          division,
          cost_center,
          grade,
          designation,
          location,
          department,
          shift,
          pan_number,
          include_pf,
          include_esi,
          include_lwf,
          pf_number,
          uan_number,
          pf_excess_contribution,
          payment_type
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting employee:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      message: 'Employee created successfully',
      employee: data[0]
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
