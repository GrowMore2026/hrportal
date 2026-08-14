const supabase = require('../../config/supabaseClient');

exports.createEmployee = async (req, res) => {
  try {
    const {
      emp_code, first_name, middle_name, last_name, title, dob, aadhaar_number, gender, blood_group, marital_status, nationality, profile_image,
      father_name, spouse_name, status, doj, probation_period, confirmation_date, notice_period, current_experience_in_year, total_experience,
      email, mobile, division, cost_center, grade, designation, location, department, shift, reporting_to,
      prev_organization, prev_designation, prev_location, prev_from_date, prev_to_date,
      present_name, present_address, present_city, present_country, present_pincode, present_phone,
      permanent_name, permanent_address, permanent_city, permanent_country, permanent_pincode, permanent_phone,
      emergency_name, emergency_relationship, emergency_address, emergency_country, emergency_pincode, emergency_phone,
      pan_number, include_pf, include_esi, include_lwf, pf_number, uan_number, pf_excess_contribution, payment_type
    } = req.body;

    // Insert into Supabase 'employees' table
    const { data, error } = await supabase
      .from('employees')
      .insert([
        {
          emp_code, first_name, middle_name, last_name, title, dob, aadhaar_number, gender, blood_group, marital_status, nationality, profile_image,
          father_name, spouse_name, status, doj, probation_period, confirmation_date, notice_period, current_experience_in_year, total_experience,
          email, mobile, division, cost_center, grade, designation, location, department, shift, reporting_to,
          prev_organization, prev_designation, prev_location, prev_from_date, prev_to_date,
          present_name, present_address, present_city, present_country, present_pincode, present_phone,
          permanent_name, permanent_address, permanent_city, permanent_country, permanent_pincode, permanent_phone,
          emergency_name, emergency_relationship, emergency_address, emergency_country, emergency_pincode, emergency_phone,
          pan_number, include_pf, include_esi, include_lwf, pf_number, uan_number, pf_excess_contribution, payment_type
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

exports.searchEmployees = async (req, res) => {
  try {
    const { query } = req.query;
    
    let dbQuery = supabase.from('employees').select('*').order('created_at', { ascending: false });
    
    if (query) {
      dbQuery = dbQuery.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,emp_code.ilike.%${query}%`);
    }

    const { data, error } = await dbQuery;

    if (error) {
      console.error('Error searching employees:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const { data, error } = await supabase.from('employees').select('*');

    if (error) {
      console.error('Error fetching all employees:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ employees: data });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    // Prevent updating immutable fields
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;
    
    // Remove frontend-only synthesized fields
    delete updateData.name;

    // Convert empty strings to null for database type constraints (e.g., date fields)
    for (const key in updateData) {
      if (updateData[key] === '') {
        updateData[key] = null;
      }
    }

    const { data, error } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating employee:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    return res.status(200).json({
      message: 'Employee updated successfully',
      employee: data[0]
    });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.bulkCreateEmployees = async (req, res) => {
  try {
    const { employees } = req.body;
    
    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ error: 'No valid employees array provided' });
    }

    // Convert empty strings to null for database constraints
    const cleanedEmployees = employees.map(emp => {
      let cleaned = { ...emp };
      for (const key in cleaned) {
        if (cleaned[key] === '') {
          cleaned[key] = null;
        }
      }
      return cleaned;
    });

    const { data, error } = await supabase
      .from('employees')
      .upsert(cleanedEmployees, { onConflict: 'emp_code' })
      .select();

    if (error) {
      console.error('Error inserting bulk employees:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      message: `${data.length} employees created successfully`,
      employees: data
    });

  } catch (err) {
    console.error('Server error in bulkCreateEmployees:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
